/**
 * Reusable Dashboard Data Hook
 * 
 * Provides common data fetching and state management for all dashboards
 * Reduces code duplication across ShopOwner, Affiliate, Admin, and User dashboards
 */

import { useState, useEffect, useCallback } from 'react';
import { useSafeAsync } from './useSafeAsync';
import { DataErrorHandler } from '../utils/errorHandler';
import { api } from '../services/api';
import { Coupon, Referral, CreditRequest } from '../types';

export interface DashboardDataOptions {
  userId: string;
  role: 'shop-owner' | 'affiliate' | 'admin' | 'user';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface DashboardData {
  coupons: Coupon[];
  referrals: Referral[];
  creditRequests: CreditRequest[];
  redemptions: unknown[];
  affiliateActivity: unknown[];
  customerData: unknown[];
  stats: {
    totalCoupons: number;
    totalRedemptions: number;
    totalCredits: number;
    totalViews: number;
  };
}

/**
 * Custom hook for dashboard data fetching
 */
export function useDashboardData(options: DashboardDataOptions) {
  const { userId, role, autoRefresh = false, refreshInterval = 300000 } = options;
  const safeAsync = useSafeAsync();

  const [data, setData] = useState<DashboardData>({
    coupons: [],
    referrals: [],
    creditRequests: [],
    redemptions: [],
    affiliateActivity: [],
    customerData: [],
    stats: {
      totalCoupons: 0,
      totalRedemptions: 0,
      totalCredits: 0,
      totalViews: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch data based on user role
   */
  const fetchData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    await safeAsync(async () => {
      try {
        let fetchedData: Partial<DashboardData> = {};

        switch (role) {
          case 'shop-owner': {
            const [
              coupons,
              referrals,
              creditRequests,
              redemptions,
              affiliates,
              customers
            ] = await Promise.all([
              api.getCouponsForShop(userId),
              api.getReferralsForShop(userId),
              api.getCreditRequestsForShop(userId),
              api.getRedemptionsForShop(userId),
              api.getAffiliatesForShop(userId),
              api.getCustomerDataForShop(userId)
            ]);

            fetchedData = {
              coupons,
              referrals,
              creditRequests,
              redemptions,
              affiliateActivity: affiliates,
              customerData: customers,
              stats: {
                totalCoupons: coupons.length,
                totalRedemptions: redemptions.length,
                totalCredits: 0, // Will be set from user object
                totalViews: coupons.reduce((sum, c) => sum + (c.clicks || 0), 0)
              }
            };
            break;
          }

          case 'affiliate': {
            const [redemptions, customers] = await Promise.all([
              api.getRedemptionsForAffiliate(userId),
              api.getCustomerDataForAffiliate(userId)
            ]);

            fetchedData = {
              coupons: [],
              referrals: [],
              creditRequests: [],
              redemptions,
              affiliateActivity: [],
              customerData: customers,
              stats: {
                totalCoupons: 0,
                totalRedemptions: redemptions.length,
                totalCredits: redemptions.reduce(
                  (sum, r) => sum + (r.commissionEarned || 0),
                  0
                ),
                totalViews: 0
              }
            };
            break;
          }

          case 'user': {
            const redemptions = await api.getRedemptionsForCustomer(userId);

            fetchedData = {
              coupons: [],
              referrals: [],
              creditRequests: [],
              redemptions,
              affiliateActivity: [],
              customerData: [],
              stats: {
                totalCoupons: 0,
                totalRedemptions: redemptions.length,
                totalCredits: redemptions.reduce(
                  (sum, r) => sum + (r.customerRewardEarned || 0),
                  0
                ),
                totalViews: 0
              }
            };
            break;
          }

          case 'admin': {
            const [requests, allCoupons] = await Promise.all([
              api.getAllCreditRequests(),
              api.getAllCoupons()
            ]);

            fetchedData = {
              coupons: allCoupons,
              referrals: [],
              creditRequests: requests,
              redemptions: [],
              affiliateActivity: [],
              customerData: [],
              stats: {
                totalCoupons: allCoupons.length,
                totalRedemptions: 0,
                totalCredits: 0,
                totalViews: allCoupons.reduce((sum, c) => sum + (c.clicks || 0), 0)
              }
            };
            break;
          }
        }

        setData(prevData => ({
          ...prevData,
          ...fetchedData
        }));
      } catch (err) {
        const errorMessage = DataErrorHandler.fetch(err, `${role}-dashboard`);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    });
  }, [userId, role, safeAsync]);

  /**
   * Initial data load
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Auto-refresh if enabled
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Simplified hook for common dashboard operations
 */
export function useShopOwnerDashboard(userId: string) {
  return useDashboardData({
    userId,
    role: 'shop-owner',
    autoRefresh: false
  });
}

export function useAffiliateDashboard(userId: string) {
  return useDashboardData({
    userId,
    role: 'affiliate',
    autoRefresh: false
  });
}

export function useUserDashboard(userId: string) {
  return useDashboardData({
    userId,
    role: 'user',
    autoRefresh: false
  });
}

export function useAdminDashboard(userId: string) {
  return useDashboardData({
    userId,
    role: 'admin',
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
  });
}
