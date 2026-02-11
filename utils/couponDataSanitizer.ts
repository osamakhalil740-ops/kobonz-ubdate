/**
 * Coupon Data Sanitization Utilities
 * 
 * This module provides comprehensive validation and sanitization for coupon data
 * to ensure Firebase compatibility and prevent undefined field errors.
 */

import { CreateCouponData, Coupon } from '../types';

/**
 * Sanitizes coupon data by removing undefined values and ensuring valid defaults
 */
export const sanitizeCouponData = (data: CreateCouponData | Partial<CreateCouponData>): Partial<CreateCouponData> => {
    // Start with a clean object
    const sanitized: Partial<CreateCouponData> = {};
    
    // Copy all defined values
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            (sanitized as any)[key] = value;
        }
    });
    
    // Ensure validity fields are properly handled
    if (sanitized.validityType === 'days') {
        // When using days, ensure validityDays has a valid value
        if (sanitized.validityDays === undefined || sanitized.validityDays === null || sanitized.validityDays <= 0) {
            sanitized.validityDays = 30; // Default to 30 days
        }
        // Remove expiryDate as it's not needed
        delete sanitized.expiryDate;
    } else if (sanitized.validityType === 'expiryDate') {
        // When using expiry date, ensure expiryDate is valid
        if (!sanitized.expiryDate) {
            // Default to 30 days from now if no expiry date provided
            const defaultExpiry = new Date();
            defaultExpiry.setDate(defaultExpiry.getDate() + 30);
            sanitized.expiryDate = defaultExpiry.toISOString().split('T')[0];
        }
        // Remove validityDays as it's not needed
        delete sanitized.validityDays;
    }
    
    // Ensure numeric fields have valid values
    if (sanitized.maxUses !== undefined && (sanitized.maxUses <= 0 || isNaN(sanitized.maxUses))) {
        sanitized.maxUses = 100; // Default max uses
    }
    
    if (sanitized.discountValue !== undefined && (sanitized.discountValue <= 0 || isNaN(sanitized.discountValue))) {
        sanitized.discountValue = 10; // Default discount value
    }
    
    if (sanitized.affiliateCommission !== undefined && isNaN(sanitized.affiliateCommission)) {
        sanitized.affiliateCommission = 0; // Default to no commission
    }
    
    if (sanitized.customerRewardPoints !== undefined && isNaN(sanitized.customerRewardPoints)) {
        sanitized.customerRewardPoints = 0; // Default to no reward points
    }
    
    return sanitized;
};

/**
 * Validates coupon data before creation/update
 */
export const validateCouponData = (data: CreateCouponData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!data.shopOwnerId?.trim()) {
        errors.push('Shop Owner ID is required');
    }
    
    if (!data.title?.trim()) {
        errors.push('Coupon title is required');
    }
    
    if (!data.description?.trim()) {
        errors.push('Coupon description is required');
    }
    
    if (!data.validityType) {
        errors.push('Validity type is required');
    }
    
    // Validity-specific validation
    if (data.validityType === 'days') {
        if (!data.validityDays || data.validityDays <= 0) {
            errors.push('Valid number of days is required when using days validity type');
        }
    } else if (data.validityType === 'expiryDate') {
        if (!data.expiryDate) {
            errors.push('Expiry date is required when using expiry date validity type');
        } else {
            const expiryDate = new Date(data.expiryDate);
            if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
                errors.push('Expiry date must be a valid future date');
            }
        }
    }
    
    // Numeric fields validation
    if (data.maxUses !== undefined && (data.maxUses <= 0 || !Number.isInteger(data.maxUses))) {
        errors.push('Max uses must be a positive integer');
    }
    
    if (data.discountValue !== undefined && data.discountValue <= 0) {
        errors.push('Discount value must be greater than 0');
    }
    
    if (data.affiliateCommission !== undefined && data.affiliateCommission < 0) {
        errors.push('Affiliate commission cannot be negative');
    }
    
    if (data.customerRewardPoints !== undefined && data.customerRewardPoints < 0) {
        errors.push('Customer reward points cannot be negative');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Filters out undefined values from any object (generic utility)
 */
export const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)
    ) as Partial<T>;
};

/**
 * Provides default values for coupon creation
 */
export const getDefaultCouponValues = (): Partial<CreateCouponData> => {
    return {
        maxUses: 100,
        discountType: 'percentage',
        discountValue: 10,
        validityType: 'expiryDate',
        validityDays: 30,
        affiliateCommission: 5,
        customerRewardPoints: 10
    };
};

/**
 * Merges user input with defaults and sanitizes the result
 */
export const prepareCouponData = (userInput: Partial<CreateCouponData>): CreateCouponData => {
    const defaults = getDefaultCouponValues();
    const merged = { ...defaults, ...userInput } as CreateCouponData;
    const sanitized = sanitizeCouponData(merged) as CreateCouponData;
    
    // Final validation to ensure all required fields are present
    if (!sanitized.shopOwnerId) throw new Error('Shop Owner ID is required');
    if (!sanitized.title) throw new Error('Title is required');
    if (!sanitized.description) throw new Error('Description is required');
    if (!sanitized.validityType) throw new Error('Validity type is required');
    if (!sanitized.discountType) throw new Error('Discount type is required');
    
    return sanitized;
};