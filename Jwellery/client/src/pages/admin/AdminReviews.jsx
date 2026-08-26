import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { reviewService } from '../../services/otherServices';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminReviews() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', status, page],
    queryFn: () => reviewService.getAllReviews({ status, page, limit }).then((r) => r.data),
    keepPreviousData: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => reviewService.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reviews']);
      toast.success('Review status updated.');
    },
    onError: () => toast.error('Failed to update review.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reviews']);
      toast.success('Review deleted.');
    },
    onError: () => toast.error('Failed to delete review.'),
  });

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || {};

  const handleDelete = (id) => {
    if (window.confirm('Delete this review permanently?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Reviews Moderation — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Moderate customer feedback and product ratings</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input-gold text-sm w-full sm:w-40 cursor-pointer"
          >
            <option value="">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl animate-pulse" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
            <Star size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No reviews found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <div key={r._id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{r.user?.name}</span>
                      <span className="text-xs text-gray-400 font-normal">({r.user?.email})</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-xs text-gray-450 truncate max-w-xs">Product: <strong>{r.product?.name}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < r.rating ? '#C5A059' : '#e5e7eb'}
                            className={i < r.rating ? 'text-[#C5A059]' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        r.status === 'approved' ? 'bg-green-50 text-green-600' :
                        r.status === 'rejected' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>{r.status}</span>
                    </div>

                    {r.title && <p className="text-sm font-semibold text-gray-850">{r.title}</p>}
                    <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">{r.comment}</p>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-start">
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: r._id, status: 'approved' })}
                        className="p-2 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: r._id, status: 'rejected' })}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-gray-600 transition-colors"
                      title="Delete Permanently"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
