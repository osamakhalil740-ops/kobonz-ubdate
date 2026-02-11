import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, where, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

export interface RealTimeTrackingData {
    redemptions: unknown[];
    systemActivity: unknown[];
    customerData: unknown[];
    userActions: unknown[];
    loading: boolean;
    lastUpdate: Date | null;
    allActivities: unknown[];
    totalActivities: number;
    realtimeStats: {
        redemptionsToday: number;
        activeUsers: number;
        lastActivity: Date | null;
    };
}

// CRITICAL: Pre-define all constants to prevent minification issues
const EMPTY_ARRAY: unknown[] = [];
const INITIAL_STATS = {
    redemptionsToday: 0,
    activeUsers: 0,
    lastActivity: null as Date | null
};

const INITIAL_STATE: RealTimeTrackingData = {
    redemptions: EMPTY_ARRAY,
    systemActivity: EMPTY_ARRAY,
    customerData: EMPTY_ARRAY,
    userActions: EMPTY_ARRAY,
    loading: true,
    lastUpdate: null,
    allActivities: EMPTY_ARRAY,
    totalActivities: 0,
    realtimeStats: INITIAL_STATS
};

// Export hook function with proper declaration to prevent hoisting issues
export const useRealTimeTracking = function useRealTimeTrackingImpl(
    userRole: string[] = [], 
    userId?: string,
    enableRealTime: boolean = true // NEW: Allow disabling real-time tracking
) {
    // Explicitly declare all variables before using them
    const unsubscribeRefs = useRef<(() => void)[]>([]);
    const isCleaningUp = useRef(false);
    
    // Initialize state with explicit typing and immutable objects
    const [trackingState, setTrackingState] = useState<RealTimeTrackingData>(() => ({
        ...INITIAL_STATE,
        redemptions: [...EMPTY_ARRAY],
        systemActivity: [...EMPTY_ARRAY],
        customerData: [...EMPTY_ARRAY],
        userActions: [...EMPTY_ARRAY],
        allActivities: [...EMPTY_ARRAY],
        realtimeStats: { ...INITIAL_STATS }
    }));

    // Declare trackUserAction first to prevent reference errors
    const trackUserAction = useCallback(async (actionData: {
        userId: string;
        userName: string;
        action: string;
        details?: unknown;
        page?: string;
        timestamp?: Date;
    }) => {
        try {
            logger.debug('📍 Tracking user action:', actionData);
            
            const userActionRef = collection(db, 'userActionLog');
            await addDoc(userActionRef, {
                ...actionData,
                timestamp: serverTimestamp(),
                dateOccurred: (actionData.timestamp || new Date()).toISOString(),
                sessionId: sessionStorage.getItem('sessionId') || 'unknown',
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer || 'direct',
                ipAddress: null,
                deviceInfo: {
                    platform: navigator.platform,
                    language: navigator.language,
                    screenResolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            });
        } catch (error) {
            logger.error('❌ Error tracking user action:', error);
        }
    }, []);

    // Helper function to safely process data
    const processDataSafely = useCallback((rawData: unknown): RealTimeTrackingData => {
        // Ensure all arrays are valid
        const safeRedemptions = Array.isArray(rawData?.redemptions) ? rawData.redemptions : [];
        const safeSystemActivity = Array.isArray(rawData?.systemActivity) ? rawData.systemActivity : [];
        const safeCustomerData = Array.isArray(rawData?.customerData) ? rawData.customerData : [];
        const safeUserActions = Array.isArray(rawData?.userActions) ? rawData.userActions : [];
        const loading = rawData?.loading !== undefined ? rawData.loading : false;
        const lastUpdate = rawData?.lastUpdate || null;

        // Combine all activities safely
        const allActivities = [
            ...safeRedemptions.map((r: unknown) => ({ 
                ...r, 
                type: 'redemption', 
                timestamp: r.redeemedAt || r.timestamp || new Date() 
            })),
            ...safeSystemActivity.map((a: unknown) => ({ 
                ...a, 
                type: 'system_activity', 
                timestamp: a.timestamp || new Date() 
            })),
            ...safeCustomerData.map((c: unknown) => ({ 
                ...c, 
                type: 'customer_interaction', 
                timestamp: c.timestamp || c.redeemedAt || new Date() 
            })),
            ...safeUserActions.map((u: unknown) => ({ 
                ...u, 
                type: 'user_action', 
                timestamp: u.timestamp || new Date() 
            }))
        ].sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeB - timeA;
        });

        // Calculate stats safely
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const realtimeStats = {
            redemptionsToday: safeRedemptions.filter((r: unknown) => {
                const redeemedAt = r.redeemedAt ? new Date(r.redeemedAt) : null;
                return redeemedAt && redeemedAt >= todayStart;
            }).length,
            activeUsers: new Set(
                safeUserActions
                    .filter((u: unknown) => {
                        const timestamp = u.timestamp ? new Date(u.timestamp) : null;
                        return timestamp && timestamp.getTime() > Date.now() - 30 * 60 * 1000;
                    })
                    .map((u: unknown) => u.userId)
                    .filter((id: unknown) => id)
            ).size,
            lastActivity: allActivities.length > 0 ? allActivities[0].timestamp : null
        };

        return {
            redemptions: safeRedemptions,
            systemActivity: safeSystemActivity,
            customerData: safeCustomerData,
            userActions: safeUserActions,
            loading,
            lastUpdate,
            allActivities,
            totalActivities: allActivities.length,
            realtimeStats
        };
    }, []);

    // Set up listeners function
    const setupListeners = useCallback(() => {
        // CRITICAL FIX: Don't set up listeners if disabled or already cleaning up
        if (!enableRealTime || isCleaningUp.current) {
            logger.debug('⚠️ Real-time tracking disabled or cleaning up, skipping listener setup');
            setTrackingState(prev => processDataSafely({
                ...prev,
                loading: false
            }));
            return [];
        }
        
        const unsubscribes: (() => void)[] = [];
        
        try {
            logger.debug('🔴 Setting up real-time listeners for roles:', userRole);
            
            // CRITICAL FIX: Add error handlers to each listener
            // Redemptions listener
            const redemptionsQuery = query(
                collection(db, 'redemptions'),
                orderBy('redeemedAt', 'desc'),
                limit(100)
            );
            
            const unsubRedemptions = onSnapshot(
                redemptionsQuery, 
                (snapshot) => {
                    if (isCleaningUp.current) return;
                    
                    const redemptions = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        redeemedAt: doc.data().redeemedAt?.toDate() || new Date()
                    }));
                    
                    setTrackingState(prev => processDataSafely({
                        ...prev,
                        redemptions,
                        lastUpdate: new Date()
                    }));
                },
                (error) => {
                    logger.error('❌ Redemptions listener error:', error);
                    // Don't crash the app, just log the error
                }
            );
            unsubscribes.push(unsubRedemptions);

            // Admin activity listener  
            const adminActivityQuery = query(
                collection(db, 'adminActivityLog'),
                orderBy('timestamp', 'desc'),
                limit(200)
            );
            
            const unsubAdminActivity = onSnapshot(
                adminActivityQuery, 
                (snapshot) => {
                    if (isCleaningUp.current) return;
                    
                    const activities = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        timestamp: doc.data().timestamp?.toDate() || new Date()
                    }));
                    
                    setTrackingState(prev => processDataSafely({
                        ...prev,
                        systemActivity: activities,
                        lastUpdate: new Date()
                    }));
                },
                (error) => {
                    logger.error('❌ Admin activity listener error:', error);
                }
            );
            unsubscribes.push(unsubAdminActivity);

            // User actions listener
            const userActionQuery = query(
                collection(db, 'userActionLog'),
                orderBy('timestamp', 'desc'),
                limit(500)
            );
            
            const unsubUserActions = onSnapshot(
                userActionQuery, 
                (snapshot) => {
                    if (isCleaningUp.current) return;
                    
                    const userActions = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        timestamp: doc.data().timestamp?.toDate() || new Date()
                    }));
                    
                    setTrackingState(prev => processDataSafely({
                        ...prev,
                        userActions,
                        lastUpdate: new Date()
                    }));
                },
                (error) => {
                    logger.error('❌ User actions listener error:', error);
                }
            );
            unsubscribes.push(unsubUserActions);

            // Customer data listener (role-based)
            if (userRole.includes('admin') || userRole.includes('super-admin') || userRole.includes('shop-owner')) {
                let customerQuery;
                
                if (userRole.includes('shop-owner') && userId) {
                    customerQuery = query(
                        collection(db, 'shopCustomerData'),
                        where('shopOwnerId', '==', userId),
                        orderBy('timestamp', 'desc'),
                        limit(100)
                    );
                } else {
                    customerQuery = query(
                        collection(db, 'shopCustomerData'),
                        orderBy('timestamp', 'desc'),
                        limit(200)
                    );
                }
                
                const unsubCustomerData = onSnapshot(
                    customerQuery, 
                    (snapshot) => {
                        if (isCleaningUp.current) return;
                        
                        const customerData = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            timestamp: doc.data().timestamp?.toDate() || new Date()
                        }));
                        
                        setTrackingState(prev => processDataSafely({
                            ...prev,
                            customerData,
                            lastUpdate: new Date()
                        }));
                    },
                    (error) => {
                        logger.error('❌ Customer data listener error:', error);
                    }
                );
                unsubscribes.push(unsubCustomerData);
            }

            // Set loading to false
            setTrackingState(prev => processDataSafely({
                ...prev,
                loading: false
            }));

        } catch (error) {
            logger.error('❌ Error setting up real-time listeners:', error);
            setTrackingState(prev => processDataSafely({
                ...prev,
                loading: false
            }));
        }

        unsubscribeRefs.current = unsubscribes;
        return unsubscribes;
    }, [userRole, userId, processDataSafely, enableRealTime]);

    // Initialize listeners on mount
    useEffect(() => {
        // CRITICAL FIX: Cleanup flag management
        isCleaningUp.current = false;
        
        const unsubscribes = setupListeners();
        
        return () => {
            logger.debug('🔴 Cleaning up real-time listeners...');
            isCleaningUp.current = true;
            
            unsubscribes.forEach(unsubscribe => {
                try {
                    unsubscribe();
                } catch (error) {
                    logger.error('❌ Error unsubscribing:', error);
                }
            });
            unsubscribeRefs.current = [];
        };
    }, [setupListeners]);

    // Page view tracking
    useEffect(() => {
        if (userId) {
            trackUserAction({
                userId,
                userName: 'Current User',
                action: 'page_view',
                page: window.location.pathname,
                details: {
                    title: document.title,
                    userRole: userRole.join(',')
                }
            });
        }
    }, [userId, userRole, trackUserAction]);

    return {
        trackingData: trackingState,
        trackUserAction,
        isRealTime: true,
        refreshData: setupListeners
    };
};