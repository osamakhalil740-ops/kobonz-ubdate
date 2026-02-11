import React, { useEffect, useState } from 'react';
import { LoyaltyPoints, TIER_BENEFITS } from '../types/loyalty.types';
import { loyaltyService } from '../services/loyaltyService';

interface LoyaltyCardProps {
  userId: string;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ userId }) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoyaltyPoints();
  }, [userId]);

  const loadLoyaltyPoints = async () => {
    setLoading(true);
    const points = await loyaltyService.getUserPoints(userId);
    setLoyaltyPoints(points);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="h-24 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!loyaltyPoints) return null;

  const tierBenefits = TIER_BENEFITS[loyaltyPoints.tier];
  const nextTier = 
    loyaltyPoints.tier === 'bronze' ? TIER_BENEFITS.silver :
    loyaltyPoints.tier === 'silver' ? TIER_BENEFITS.gold :
    loyaltyPoints.tier === 'gold' ? TIER_BENEFITS.platinum :
    null;

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white">
      {/* Tier Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{tierBenefits.icon}</div>
          <div>
            <h3 className="text-xl font-bold">{tierBenefits.name}</h3>
            <p className="text-sm text-purple-200">
              {loyaltyPoints.availablePoints.toLocaleString()} points available
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {loyaltyPoints.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-purple-200">Total Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {nextTier.name}</span>
            <span>{Math.round(loyaltyPoints.tierProgress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${loyaltyPoints.tierProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-purple-200 mt-1">
            {nextTier.requiredPoints - loyaltyPoints.lifetimePoints} points to next tier
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-sm text-purple-200">Multiplier</div>
          <div className="text-xl font-bold">{tierBenefits.pointsMultiplier}x</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-sm text-purple-200">Used</div>
          <div className="text-xl font-bold">{loyaltyPoints.usedPoints}</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-sm text-purple-200">Lifetime</div>
          <div className="text-xl font-bold">{loyaltyPoints.lifetimePoints}</div>
        </div>
      </div>

      {/* Benefits Preview */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <h4 className="text-sm font-semibold mb-2">Your Benefits:</h4>
        <ul className="text-xs space-y-1">
          {tierBenefits.benefits.slice(0, 3).map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-300">✓</span>
              <span className="text-purple-100">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoyaltyCard;
