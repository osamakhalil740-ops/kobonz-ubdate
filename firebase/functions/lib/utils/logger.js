"use strict";
/**
 * Production-safe logger utility
 * Only logs in development mode
 * In production, errors are sent to monitoring service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.track = exports.error = exports.warn = exports.info = exports.debug = exports.logger = void 0;
class Logger {
    constructor() {
        this.isDevelopment = import.meta.env.DEV;
        this.isProduction = import.meta.env.PROD;
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }
    shouldLog(level) {
        // In production, only log errors
        if (this.isProduction) {
            return level === 'error';
        }
        // In development, log everything
        return this.isDevelopment;
    }
    debug(message, context) {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', message, context));
        }
    }
    info(message, context) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message, context));
        }
    }
    warn(message, context) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, context));
        }
    }
    error(message, error, context) {
        const errorContext = Object.assign(Object.assign({}, context), { error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
            } : error });
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, errorContext));
        }
        // In production, send to error monitoring service
        if (this.isProduction && typeof window !== 'undefined') {
            // Error monitoring will be integrated here (Sentry)
            this.reportToMonitoring(message, error, errorContext);
        }
    }
    reportToMonitoring(message, error, context) {
        // Integrated with Sentry error monitoring
        try {
            Promise.resolve().then(() => require('../config/monitoring')).then(({ default: Sentry }) => {
                if (Sentry && Sentry.captureException) {
                    Sentry.captureException(error, {
                        extra: Object.assign({ message }, context)
                    });
                }
            }).catch(() => {
                // Silently fail - don't break app if monitoring fails
            });
        }
        catch (e) {
            // Silently fail - don't break app if monitoring fails
        }
    }
    // Special method for tracking user actions (analytics)
    track(event, properties) {
        if (this.isDevelopment) {
            console.log(`📊 TRACK: ${event}`, properties);
        }
        // In production, this would go to analytics service
    }
}
// Export singleton instance
exports.logger = new Logger();
// Convenience exports
exports.debug = exports.logger.debug, exports.info = exports.logger.info, exports.warn = exports.logger.warn, exports.error = exports.logger.error, exports.track = exports.logger.track;
//# sourceMappingURL=logger.js.map