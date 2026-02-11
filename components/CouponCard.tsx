
import React, { memo, useMemo } from 'react';
import { Coupon } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { CalendarDaysIcon, CheckBadgeIcon, EyeIcon, SparklesIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface CouponCardProps {
    coupon: Coupon;
    children?: React.ReactNode;
    showAffiliateCommission?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = memo(({ coupon, children, showAffiliateCommission = false }) => {
    const { t } = useTranslation();

    const getDiscountText = () => {
        if (coupon.discountType === 'percentage') {
            return `${coupon.discountValue}% ${t('couponCard.off')}`;
        }
        return `${coupon.discountValue} ${t('couponCard.egpOff')}`;
    };

    const getValidityText = () => {
        if (coupon.validityType === 'expiryDate' && coupon.expiryDate) {
            const date = new Date(coupon.expiryDate);
            return `${t('couponCard.validUntil')} ${date.toLocaleDateString()}`;
        }
        if (coupon.validityType === 'days' && coupon.validityDays) {
            const expiry = new Date(new Date(coupon.createdAt).getTime() + coupon.validityDays * 24 * 60 * 60 * 1000);
            return `${t('couponCard.expiresOn')} ${expiry.toLocaleDateString()}`;
        }
        return t('couponCard.noExpiry');
    };

    // Memoize expensive calculations
    const { expired, status, statusColor } = useMemo(() => {
        const isExpired = () => {
            if (coupon.usesLeft <= 0) return true;
            if (coupon.validityType === 'expiryDate' && coupon.expiryDate) {
                return new Date(coupon.expiryDate) < new Date();
            }
            if (coupon.validityType === 'days' && coupon.validityDays) {
                const expiry = new Date(new Date(coupon.createdAt).getTime() + coupon.validityDays * 24 * 60 * 60 * 1000);
                return expiry < new Date();
            }
            return false;
        };
        
        const expired = isExpired();
        return {
            expired,
            status: expired ? t('couponCard.status.inactive') : t('couponCard.status.active'),
            statusColor: expired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        };
    }, [coupon.usesLeft, coupon.validityType, coupon.expiryDate, coupon.validityDays, coupon.createdAt, t]);

    return (
        <div className={`enhanced-card card-lift p-5 flex flex-col justify-between ${expired ? 'opacity-60' : ''} bounce-in`}>
            <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-bold text-gray-800 flex-1 line-clamp-2 break-all">{coupon.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor} whitespace-nowrap flex-shrink-0`}>{status}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4 break-all line-clamp-1">by {coupon.shopOwnerName}</p>
                
                <p className="text-sm text-gray-600 mb-4 min-h-[40px] line-clamp-2 break-all">{coupon.description}</p>
                
                <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-4 rounded-lg text-center mb-4">
                     <p className="text-3xl font-extrabold text-primary">{getDiscountText()}</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                        <span>{getValidityText()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckBadgeIcon className="h-5 w-5 text-gray-400" />
                        <span>{coupon.usesLeft} / {coupon.maxUses} {t('couponCard.usesLeft')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                        <span>{coupon.clicks} {t('couponCard.views')}</span>
                    </div>
                    {/* Location Information */}
                    {coupon.isGlobal ? (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <GlobeAltIcon className="h-5 w-5" />
                            <span>Valid Globally</span>
                        </div>
                    ) : (
                        <>
                            {coupon.countries && coupon.countries.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-purple-500" />
                                    <span className="text-xs">
                                        {coupon.countries.slice(0, 2).join(', ')}
                                        {coupon.countries.length > 2 && ` +${coupon.countries.length - 2} more`}
                                    </span>
                                </div>
                            )}
                            {coupon.cities && coupon.cities.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-blue-500" />
                                    <span className="text-xs">
                                        {coupon.cities.slice(0, 2).join(', ')}
                                        {coupon.cities.length > 2 && ` +${coupon.cities.length - 2} more`}
                                    </span>
                                </div>
                            )}
                            {coupon.areas && coupon.areas.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-pink-500" />
                                    <span className="text-xs">
                                        {coupon.areas.slice(0, 2).join(', ')}
                                        {coupon.areas.length > 2 && ` +${coupon.areas.length - 2} more`}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                    {showAffiliateCommission && coupon.affiliateCommission > 0 && (
                        <div className="flex items-center gap-2 pt-2 text-success font-semibold border-t border-dashed mt-3">
                            <SparklesIcon className="h-5 w-5" />
                            <span>{t('couponCard.earn')} {coupon.affiliateCommission} {t('common.credits')} {t('couponCard.onRedeem')}</span>
                        </div>
                    )}
                    {coupon.customerRewardPoints > 0 && (
                        <div className="flex items-center gap-2 pt-2 text-primary font-semibold border-t border-dashed mt-3">
                            <SparklesIcon className="h-5 w-5" />
                            <span>Customer earns {coupon.customerRewardPoints} {t('common.credits')} on redemption</span>
                        </div>
                    )}
                </div>
            </div>
            {children && !expired && <div className="mt-6 pt-4 border-t border-gray-200">{children}</div>}
        </div>
    );
});

CouponCard.displayName = 'CouponCard';

export default CouponCard;