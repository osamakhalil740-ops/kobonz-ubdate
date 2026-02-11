import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, Timestamp, Firestore } from 'firebase/firestore';
import { db } from '../firebase';
import { UserCircleIcon, TrashIcon, ShieldCheckIcon, BuildingStorefrontIcon, CurrencyDollarIcon, UserIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ClockIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { Shop, Role } from '../types';
import { logger } from '../utils/logger';

interface UserData extends Omit<Shop, 'bannedUntil'> {
  createdAt?: any;
  bannedUntil?: string | Timestamp;
  banReason?: string;
}

interface Coupon {
  id: string;
  title: string;
  shopOwnerId: string;
  shopOwnerName: string;
  createdAt: any;
  status: string;
}

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'coupon'; id: string; name: string } | null>(null);
  const [viewMode, setViewMode] = useState<'users' | 'coupons'>('users');
  const [showBanModal, setShowBanModal] = useState(false);
  const [banPeriod, setBanPeriod] = useState<string>('7'); // days
  const [banReason, setBanReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  // Load all users from shops collection
  const loadUsers = async () => {
    try {
      const shopsSnapshot = await getDocs(collection(db as Firestore, 'shops'));
      const usersData = shopsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'] || '',
          email: data['email'] || '',
          roles: data['roles'] || [],
          credits: data['credits'] || 0,
          referralCode: data['referralCode'] || '',
          referredBy: data['referredBy'],
          hasRedeemedFirstCoupon: data['hasRedeemedFirstCoupon'] || false,
          country: data['country'] || '',
          city: data['city'] || '',
          category: data['category'] || '',
          district: data['district'] || '',
          shopDescription: data['shopDescription'] || '',
          addressLine1: data['addressLine1'] || '',
          addressLine2: data['addressLine2'] || '',
          state: data['state'] || '',
          postalCode: data['postalCode'] || '',
          bannedUntil: data['bannedUntil'],
          banReason: data['banReason'] || '',
          createdAt: data['createdAt'],
          isActive: data['isActive'] !== false
        };
      }) as UserData[];
      setUsers(usersData);
    } catch (error) {
      logger.error('Error loading users:', error);
    }
  };

  // Load all coupons with retry logic
  const loadCoupons = async () => {
    try {
      // Disable real-time listeners to avoid QUIC errors
      const couponsSnapshot = await getDocs(collection(db as Firestore, 'coupons'));
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      setCoupons(couponsData);
      logger.debug('Loaded coupons successfully', { count: couponsData.length });
    } catch (error) {
      logger.error('Error loading coupons:', error);
      alert('Error loading coupons. Please refresh the page.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadUsers(), loadCoupons()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Check if user is currently banned
  const isUserBanned = (user: UserData): boolean => {
    if (!user.bannedUntil) return false;
    const bannedUntil = user.bannedUntil instanceof Timestamp 
      ? user.bannedUntil.toDate() 
      : new Date(user.bannedUntil);
    return bannedUntil > new Date();
  };

  // Get ban expiration date
  const getBanExpiration = (user: UserData): string | null => {
    if (!user.bannedUntil) return null;
    const bannedUntil = user.bannedUntil instanceof Timestamp 
      ? user.bannedUntil.toDate() 
      : new Date(user.bannedUntil);
    return bannedUntil.toLocaleString();
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.shopDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || 
                       user.roles.some(role => {
                         const roleMap: Record<string, string> = {
                           'shop-owner': 'shop_owner',
                           'affiliate': 'affiliate',
                           'user': 'customer',
                           'admin': 'admin'
                         };
                         return roleMap[role] === roleFilter || role === roleFilter;
                       });
    return matchesSearch && matchesRole;
  });


  // Get user's coupons
  const getUserCoupons = (userId: string) => {
    return coupons.filter(coupon => coupon.shopOwnerId === userId);
  };

  // Delete user account with better error handling
  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(true);
      logger.debug('Attempting to delete user', { userId });
      
      // Get user's coupons first
      const userCoupons = getUserCoupons(userId);
      logger.debug(`Found ${userCoupons.length} coupons to delete`, { userId, couponCount: userCoupons.length });
      
      // Delete all user's coupons first
      for (const coupon of userCoupons) {
        try {
          await deleteDoc(doc(db as Firestore, 'coupons', coupon.id));
          logger.debug('Deleted coupon', { couponId: coupon.id });
        } catch (error) {
          logger.error('Error deleting coupon', { couponId: coupon.id, error });
        }
      }
      
      // Delete user document from shops collection
      await deleteDoc(doc(db as Firestore, 'shops', userId));
      logger.debug('User document deleted');
      
      // Update local state immediately
      setUsers(prev => prev.filter(u => u.id !== userId));
      setCoupons(prev => prev.filter(c => c.shopOwnerId !== userId));
      
      setSelectedUser(null);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      alert(`✅ User and ${userCoupons.length} associated coupons deleted successfully`);
      
      // Reload in background
      setTimeout(() => {
        loadUsers();
        loadCoupons();
      }, 1000);
    } catch (error: any) {
      logger.error('Error deleting user:', error);
      alert(`❌ Error deleting user: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete coupon with better error handling
  const handleDeleteCoupon = async (couponId: string) => {
    try {
      logger.debug('Attempting to delete coupon', { couponId });
      await deleteDoc(doc(db as Firestore, 'coupons', couponId));
      logger.debug('Coupon deleted successfully', { couponId });
      
      // Update local state immediately
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      alert('Coupon deleted successfully');
      
      // Reload in background
      setTimeout(() => loadCoupons(), 1000);
    } catch (error: any) {
      logger.error('Error deleting coupon:', error);
      alert(`Error deleting coupon: ${error.message || 'Unknown error'}`);
    }
  };

  // Ban user for a specific period
  const handleBanUser = async (userId: string) => {
    if (!banPeriod || parseInt(banPeriod) <= 0) {
      alert('Please enter a valid ban period (days)');
      return;
    }

    try {
      setActionLoading(true);
      const days = parseInt(banPeriod);
      const banExpiration = new Date();
      banExpiration.setDate(banExpiration.getDate() + days);
      
      await updateDoc(doc(db as Firestore, 'shops', userId), {
        bannedUntil: Timestamp.fromDate(banExpiration),
        banReason: banReason || 'No reason provided'
      });
      
      await loadUsers();
      setShowBanModal(false);
      setBanPeriod('7');
      setBanReason('');
      alert(`✅ User banned for ${days} day(s). Ban expires on ${banExpiration.toLocaleString()}`);
    } catch (error: any) {
      logger.error('Error banning user:', error);
      alert(`❌ Error banning user: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Unban user
  const handleUnbanUser = async (userId: string) => {
    try {
      setActionLoading(true);
      await updateDoc(doc(db as Firestore, 'shops', userId), {
        bannedUntil: null,
        banReason: null
      });
      
      await loadUsers();
      alert('✅ User unbanned successfully');
    } catch (error: any) {
      logger.error('Error unbanning user:', error);
      alert(`❌ Error unbanning user: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle user active status
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setActionLoading(true);
      await updateDoc(doc(db as Firestore, 'shops', userId), {
        isActive: !currentStatus
      });
      await loadUsers();
      alert(`✅ User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      logger.error('Error updating user status:', error);
      alert(`❌ Error updating user status: ${error.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (roles: Role[]) => {
    if (roles.includes('admin')) return <ShieldCheckIcon className="h-5 w-5" />;
    if (roles.includes('shop-owner')) return <BuildingStorefrontIcon className="h-5 w-5" />;
    if (roles.includes('affiliate')) return <CurrencyDollarIcon className="h-5 w-5" />;
    return <UserIcon className="h-5 w-5" />;
  };

  const getRoleBadgeColor = (roles: Role[]) => {
    if (roles.includes('admin')) return 'bg-purple-100 text-purple-800';
    if (roles.includes('shop-owner')) return 'bg-blue-100 text-blue-800';
    if (roles.includes('affiliate')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleDisplayName = (roles: Role[]): string => {
    if (roles.includes('admin')) return 'Admin';
    if (roles.includes('shop-owner')) return 'Shop Owner';
    if (roles.includes('affiliate')) return 'Affiliate';
    return 'Customer';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
            <p className="text-gray-600">Manage all registered users, accounts, and coupons</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'users'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setViewMode('coupons')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'coupons'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
              }`}
            >
              All Coupons ({coupons.length})
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Coupons</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{coupons.length}</p>
            </div>
            <svg className="h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
            </div>
            <UserCircleIcon className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Shop Owners</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {users.filter(u => u.roles.includes('shop-owner')).length}
              </p>
            </div>
            <BuildingStorefrontIcon className="h-12 w-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Affiliates</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {users.filter(u => u.roles.includes('affiliate')).length}
              </p>
            </div>
            <CurrencyDollarIcon className="h-12 w-12 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Customers</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {users.filter(u => u.roles.includes('user')).length}
              </p>
            </div>
            <UserIcon className="h-12 w-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, name, or shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="shop-owner">Shop Owners</option>
              <option value="affiliate">Affiliates</option>
              <option value="user">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid/List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedUser?.id === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getRoleIcon(user.roles)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name || 'No Name'}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.roles)}`}>
                          {getRoleDisplayName(user.roles)}
                        </span>
                        {isUserBanned(user) && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                            <NoSymbolIcon className="h-3 w-3" />
                            Banned
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      {user.shopDescription && (
                        <p className="text-sm text-gray-500 mt-1">🏪 {user.shopDescription}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          user.isActive !== false && !isUserBanned(user) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive !== false && !isUserBanned(user) ? 'Active' : isUserBanned(user) ? 'Banned' : 'Inactive'}
                        </span>
                        {user.roles.includes('shop-owner') && (
                          <span className="text-xs text-gray-500">
                            {getUserCoupons(user.id).length} coupons
                          </span>
                        )}
                        {isUserBanned(user) && getBanExpiration(user) && (
                          <span className="text-xs text-red-600">
                            Until: {getBanExpiration(user)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* User Details Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedUser ? (
            <div>
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name || 'No Name'}</h2>
                    <p className="text-gray-600 mt-1">{selectedUser.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRoleBadgeColor(selectedUser.roles)}`}>
                      {getRoleDisplayName(selectedUser.roles)}
                    </span>
                    {isUserBanned(selectedUser) && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                        <NoSymbolIcon className="h-4 w-4" />
                        Banned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* User Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-gray-900 font-mono text-sm mt-1">{selectedUser.id}</p>
                  </div>


                  {selectedUser.shopDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Shop Description</label>
                      <p className="text-gray-900 mt-1">{selectedUser.shopDescription}</p>
                    </div>
                  )}

                  {selectedUser.referralCode && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Referral Code</label>
                      <p className="text-gray-900 font-mono mt-1">{selectedUser.referralCode}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Credits</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedUser.credits || 0}</p>
                  </div>

                  {isUserBanned(selectedUser) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ban Status</label>
                      <p className="mt-1 font-semibold text-red-600">
                        Banned until: {getBanExpiration(selectedUser) || 'N/A'}
                      </p>
                      {selectedUser.banReason && (
                        <p className="text-sm text-gray-600 mt-1">Reason: {selectedUser.banReason}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p className={`mt-1 font-semibold ${
                      selectedUser.isActive !== false && !isUserBanned(selectedUser) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isUserBanned(selectedUser) ? 'Banned' : selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="text-gray-900 mt-1">
                      {selectedUser.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* User's Coupons */}
                {selectedUser.roles.includes('shop-owner') && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      User's Coupons ({getUserCoupons(selectedUser.id).length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getUserCoupons(selectedUser.id).map(coupon => (
                        <div key={coupon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{coupon.title}</p>
                            <p className="text-sm text-gray-500">Status: {coupon.status}</p>
                          </div>
                          <button
                            onClick={() => {
                              setDeleteTarget({ type: 'coupon', id: coupon.id, name: coupon.title });
                              setShowDeleteConfirm(true);
                            }}
                            className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      {getUserCoupons(selectedUser.id).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No coupons yet</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {isUserBanned(selectedUser) ? (
                    <button
                      onClick={() => handleUnbanUser(selectedUser.id)}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ClockIcon className="h-5 w-5" />
                      {actionLoading ? 'Processing...' : 'Unban User'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowBanModal(true);
                      }}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <NoSymbolIcon className="h-5 w-5" />
                      Ban User
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.isActive !== false)}
                    disabled={actionLoading}
                    className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                      selectedUser.isActive !== false
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {selectedUser.isActive !== false ? 'Deactivate Account' : 'Activate Account'}
                  </button>

                  <button
                    onClick={() => {
                      setDeleteTarget({ type: 'user', id: selectedUser.id, name: selectedUser.name || selectedUser.email });
                      setShowDeleteConfirm(true);
                    }}
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete User & All Data
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <UserCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ban User</h3>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanPeriod('7');
                  setBanReason('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Period (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={banPeriod}
                  onChange={(e) => setBanPeriod(e.target.value)}
                  placeholder="Enter number of days"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ban Reason (Optional)
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for ban..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-sm text-orange-800">
                  <strong>User:</strong> {selectedUser.name} ({selectedUser.email})
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  This will ban the user for {banPeriod} day(s). They will not be able to access their account until the ban expires.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanPeriod('7');
                  setBanReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBanUser(selectedUser.id)}
                disabled={actionLoading || !banPeriod || parseInt(banPeriod) <= 0}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium transition-colors"
              >
                {actionLoading ? 'Processing...' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm {deleteTarget.type === 'user' ? 'User' : 'Coupon'} Deletion
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteTarget.name}</span>?
                {deleteTarget.type === 'user' && (
                  <span className="block mt-2 text-red-600 font-semibold">
                    This will delete the user account and ALL associated coupons permanently!
                  </span>
                )}
                <span className="block mt-2 text-sm">This action cannot be undone.</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteTarget.type === 'user') {
                    handleDeleteUser(deleteTarget.id);
                  } else {
                    handleDeleteCoupon(deleteTarget.id);
                  }
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
