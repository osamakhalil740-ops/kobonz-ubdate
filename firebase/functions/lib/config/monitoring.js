"use strict";
/**
 * Monitoring and Analytics Configuration
 * Integrates Sentry for error tracking and analytics services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceMonitor = exports.PerformanceMonitor = exports.analytics = exports.initSentry = void 0;
const Sentry = require("@sentry/react");
const constants_1 = require("./constants");
// Sentry Configuration
const initSentry = () => {
    if (constants_1.IS_PROD) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN || '',
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: true,
                    blockAllMedia: true,
                }),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            // Environment
            environment: constants_1.IS_PROD ? 'production' : 'development',
            // Release tracking
            release: `kobonz@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
            // Ignore certain errors
            ignoreErrors: [
                'ResizeObserver loop limit exceeded',
                'Non-Error promise rejection captured',
            ],
            // Add user context
            beforeSend(event, hint) {
                // Filter out non-critical errors
                if (event.exception) {
                    const error = hint.originalException;
                    if (error && typeof error === 'object' && 'message' in error) {
                        const message = error.message;
                        // Ignore common browser extensions errors
                        if (message.includes('chrome-extension://')) {
                            return null;
                        }
                    }
                }
                return event;
            },
        });
    }
};
exports.initSentry = initSentry;
class AnalyticsService {
    constructor() {
        this.enabled = constants_1.IS_PROD;
    }
    // Track custom events
    track(event, properties) {
        if (!this.enabled) {
            console.log(`📊 [Analytics] ${event}`, properties);
            return;
        }
        // Send to analytics services
        this.sendToServices({ event, properties });
    }
    // Track page views
    pageView(page, properties) {
        this.track('page_view', Object.assign({ page }, properties));
    }
    // Track user actions
    userAction(action, properties) {
        this.track('user_action', Object.assign({ action }, properties));
    }
    // Set user identity
    identify(userId, traits) {
        if (!this.enabled) {
            console.log(`👤 [Analytics] Identify: ${userId}`, traits);
            return;
        }
        // Set user in Sentry
        Sentry.setUser(Object.assign({ id: userId }, traits));
    }
    // Track coupon events
    couponCreated(couponId, properties) {
        this.track('coupon_created', Object.assign({ coupon_id: couponId }, properties));
    }
    couponRedeemed(couponId, properties) {
        this.track('coupon_redeemed', Object.assign({ coupon_id: couponId }, properties));
    }
    couponShared(couponId, platform) {
        this.track('coupon_shared', { coupon_id: couponId, platform });
    }
    // Track user registration
    userSignup(userId, role) {
        this.track('user_signup', { user_id: userId, role });
    }
    userLogin(userId) {
        this.track('user_login', { user_id: userId });
    }
    // Track marketplace actions
    shopViewed(shopId, shopName) {
        this.track('shop_viewed', { shop_id: shopId, shop_name: shopName });
    }
    searchPerformed(query, resultsCount) {
        this.track('search_performed', { query, results_count: resultsCount });
    }
    // Track performance metrics
    sendToServices(data) {
        // In production, send to multiple analytics services
        try {
            // Google Analytics 4 (if configured)
            if (window.gtag) {
                window.gtag('event', data.event, data.properties);
            }
            // Custom analytics endpoint (if you have one)
            if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
                fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }).catch(console.error);
            }
        }
        catch (error) {
            console.error('Analytics error:', error);
        }
    }
}
// Export singleton
exports.analytics = new AnalyticsService();
// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.marks = new Map();
    }
    start(name) {
        this.marks.set(name, performance.now());
    }
    end(name) {
        const startTime = this.marks.get(name);
        if (!startTime)
            return null;
        const duration = performance.now() - startTime;
        this.marks.delete(name);
        // Log slow operations
        if (duration > 1000) {
            console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
            // Send to Sentry in production
            if (constants_1.IS_PROD) {
                Sentry.captureMessage(`Slow operation: ${name}`, {
                    level: 'warning',
                    extra: { duration },
                });
            }
        }
        // Track in analytics
        exports.analytics.track('performance_metric', {
            metric: name,
            duration: Math.round(duration),
        });
        return duration;
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
exports.performanceMonitor = new PerformanceMonitor();
//# sourceMappingURL=monitoring.js.map