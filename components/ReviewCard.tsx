import React, { useState } from 'react';
import { ShopReview } from '../types/reviews.types';
import { reviewService } from '../services/reviewService';
import { StarIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ReviewCardProps {
  review: ShopReview;
  canRespond?: boolean;
  onResponseAdded?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, canRespond, onResponseAdded }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleMarkHelpful = async (isHelpful: boolean) => {
    await reviewService.markReviewHelpful(review.id, isHelpful);
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;
    
    setSubmitting(true);
    const success = await reviewService.addMerchantResponse(
      review.id,
      review.userId, // Should be merchant ID
      response
    );
    
    if (success) {
      setShowResponseForm(false);
      setResponse('');
      onResponseAdded?.();
    }
    setSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="w-5 h-5 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verifiedPurchase && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700">{review.comment}</p>
      </div>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Merchant Response */}
      {review.merchantResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 font-semibold text-sm">
              Response from merchant:
            </div>
          </div>
          <p className="text-gray-700 mt-2">{review.merchantResponse.response}</p>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(review.merchantResponse.respondedAt).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Response Form */}
      {canRespond && !review.merchantResponse && showResponseForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your response..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmitResponse}
              disabled={submitting || !response.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
            <button
              onClick={() => setShowResponseForm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMarkHelpful(true)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <HandThumbUpIcon className="w-4 h-4" />
            <span>Helpful ({review.helpful})</span>
          </button>
          <button
            onClick={() => handleMarkHelpful(false)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <HandThumbDownIcon className="w-4 h-4" />
            <span>Not Helpful ({review.notHelpful})</span>
          </button>
        </div>
        
        {canRespond && !review.merchantResponse && !showResponseForm && (
          <button
            onClick={() => setShowResponseForm(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
