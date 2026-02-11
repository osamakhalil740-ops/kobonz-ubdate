"use strict";
/**
 * Application Configuration Constants
 *
 * Centralized configuration management with environment variable validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.VALIDATION_LIMITS = exports.RATE_LIMITS = exports.FEATURES = exports.FIREBASE_CONFIG = exports.UI_CONFIG = exports.CREDIT_CONFIG = exports.COUPON_CONFIG = exports.APP_URL = exports.GEONAMES_USERNAME = exports.SUPER_ADMIN_EMAIL = exports.ANALYTICS_ENABLED = exports.SENTRY_DSN = exports.APP_VERSION = exports.MODE = exports.IS_PROD = exports.IS_DEV = void 0;
const logger_1 = require("../utils/logger");
/**
 * Validate required environment variables
 */
function validateEnvVar(varName, fallback) {
    const value = import.meta.env[varName];
    if (!value) {
        if (fallback) {
            logger_1.logger.warn(`${varName} not set, using fallback: ${fallback}`);
            return fallback;
        }
        throw new Error(`Required environment variable ${varName} is not set. ` +
            `Please check your .env file or environment configuration.`);
    }
    return value;
}
/**
 * Application mode
 */
exports.IS_DEV = import.meta.env.DEV;
exports.IS_PROD = import.meta.env.PROD;
exports.MODE = import.meta.env.MODE;
/**
 * Application Version
 */
exports.APP_VERSION = '2.0.0';
/**
 * Monitoring Configuration
 */
exports.SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
exports.ANALYTICS_ENABLED = exports.IS_PROD;
/**
 * Super Admin Configuration
 * SECURITY: This email should be set via environment variable
 */
exports.SUPER_ADMIN_EMAIL = validateEnvVar('VITE_ADMIN_EMAIL', exports.IS_DEV ? 'admin@kobonz.site' : undefined);
/**
 * GeoNames API Configuration
 */
exports.GEONAMES_USERNAME = validateEnvVar('VITE_GEONAMES_USERNAME', exports.IS_DEV ? 'demo' : undefined);
/**
 * Application URLs
 */
exports.APP_URL = exports.IS_PROD
    ? 'https://kobonz.site'
    : window.location.origin;
/**
 * Coupon Configuration
 */
exports.COUPON_CONFIG = {
    CREATION_COST: 50, // Credits required to create a coupon
    DEFAULT_MAX_USES: 100,
    DEFAULT_VALIDITY_DAYS: 30,
    DEFAULT_DISCOUNT_PERCENTAGE: 10,
    DEFAULT_AFFILIATE_COMMISSION: 5,
    DEFAULT_CUSTOMER_REWARD: 10,
};
/**
 * Credit System Configuration
 */
exports.CREDIT_CONFIG = {
    STANDARD_SIGNUP_BONUS: 1000,
    REFERRED_SIGNUP_BONUS: 5000,
    REFERRER_BONUS: 10000, // Bonus when referred user redeems first coupon
    MIN_CREDIT_REQUEST: 100,
    MAX_CREDIT_REQUEST: 100000,
    CREDIT_REQUEST_INCREMENT: 100, // Must be multiple of this
};
/**
 * UI Configuration
 */
exports.UI_CONFIG = {
    DEBOUNCE_DELAY: 300, // ms for search inputs
    AUTO_REFRESH_INTERVAL: 300000, // 5 minutes
    MAX_TOAST_DURATION: 5000, // ms
    PAGINATION_SIZE: 20,
    MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
};
/**
 * Firebase Configuration
 * Note: These are public and safe to expose in client-side code
 */
exports.FIREBASE_CONFIG = {
    apiKey: "AIzaSyBg-9a8Qv7yohzmPQyPHi8zcKWrCxOp_hg",
    authDomain: "effortless-coupon-management.firebaseapp.com",
    projectId: "effortless-coupon-management",
    storageBucket: "effortless-coupon-management.firebasestorage.app",
    messagingSenderId: "674509917896",
    appId: "1:674509917896:web:4dab684ec72dff301adffd",
    measurementId: "G-5T0WC2L3JD"
};
/**
 * Feature Flags
 * Toggle features on/off without code changes
 */
exports.FEATURES = {
    ENABLE_OFFLINE_MODE: true,
    ENABLE_REAL_TIME_TRACKING: true,
    ENABLE_ANALYTICS: exports.IS_PROD,
    ENABLE_ERROR_REPORTING: exports.IS_PROD,
    ENABLE_DEBUG_LOGS: exports.IS_DEV,
    ENABLE_LOCATION_CACHING: true,
};
/**
 * API Rate Limits
 */
exports.RATE_LIMITS = {
    COUPON_CLICK_THROTTLE: 1000, // 1 click per second
    API_CALL_THROTTLE: 500, // General API throttle
    SEARCH_DEBOUNCE: 300, // Search input debounce
};
/**
 * Validation Limits
 */
exports.VALIDATION_LIMITS = {
    COUPON_TITLE_MIN: 3,
    COUPON_TITLE_MAX: 100,
    COUPON_DESC_MIN: 10,
    COUPON_DESC_MAX: 500,
    USER_NAME_MIN: 2,
    USER_NAME_MAX: 100,
    PASSWORD_MIN: 6,
    PASSWORD_MAX: 128,
    MAX_USES_MIN: 1,
    MAX_USES_MAX: 10000,
    DISCOUNT_VALUE_MIN: 0.01,
    DISCOUNT_VALUE_MAX: 99999,
};
/**
 * Export all configuration as a single object for easy access
 */
exports.CONFIG = {
    MODE: exports.MODE,
    IS_DEV: exports.IS_DEV,
    IS_PROD: exports.IS_PROD,
    SUPER_ADMIN_EMAIL: exports.SUPER_ADMIN_EMAIL,
    GEONAMES_USERNAME: exports.GEONAMES_USERNAME,
    APP_URL: exports.APP_URL,
    COUPON: exports.COUPON_CONFIG,
    CREDIT: exports.CREDIT_CONFIG,
    UI: exports.UI_CONFIG,
    FIREBASE: exports.FIREBASE_CONFIG,
    FEATURES: exports.FEATURES,
    RATE_LIMITS: exports.RATE_LIMITS,
    VALIDATION: exports.VALIDATION_LIMITS,
};
// Log configuration in development
if (exports.IS_DEV) {
    logger_1.logger.debug('Application Configuration', {
        mode: exports.MODE,
        superAdmin: exports.SUPER_ADMIN_EMAIL,
        geonames: exports.GEONAMES_USERNAME ? 'Configured' : 'Not configured',
        features: exports.FEATURES,
    });
}
//# sourceMappingURL=constants.js.map