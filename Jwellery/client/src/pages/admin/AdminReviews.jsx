import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Star, Check, X, Trash2, ShieldCheck, MessageSquare } from 'lucide-react';
import { reviewService } from '../../services/otherServices';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admin-reviews']);
      toast.success(res?.data?.message || 'Review status updated.');
    },
    onError: () => toast.error('Failed to update review status.'),
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
    if (window.confirm('Delete this client testimonial permanently?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (rStatus) => {
    switch (rStatus?.toLowerCase()) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Moderation</Badge>;
    }
  };

  return (
    <>
      <Helmet><title>Client Testimonials Moderation — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Client Testimonials & Feedback
            </h1>
            <Badge variant="gold" className="text-[10px]">
              {reviews.length} Testimonials
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Review, moderate, and approve customer ratings for craftsmanship verification.
          </p>
        </div>

        {/* Toolbar Card */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-10 px-3.5 bg-gray-50/50 border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059] cursor-pointer"
            >
              <option value="">All Feedback</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </Card>

        {/* Reviews List */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-16 text-center">
              <MessageSquare size={40} className="text-[#C5A059]/40 mx-auto mb-3" />
              <p className="text-gray-900 font-medium text-sm">No client feedback found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <div key={r._id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-amber-50/15 transition-colors">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <Avatar className="w-10 h-10 rounded-full border border-[#DED3C4] flex-shrink-0">
                      <AvatarFallback className="bg-amber-50 text-[#8C6D2D] font-bold text-xs">
                        {r.user?.name?.[0] || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900 text-xs">{r.user?.name || 'Valued Patron'}</span>
                        <span className="text-[10px] text-[#756A63] font-light">({r.user?.email})</span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-xs text-[#8C6D2D] font-medium">
                          {r.product?.name}
                        </span>
                        {r.isVerifiedPurchase && (
                          <Badge variant="gold" className="text-[9px] gap-1 px-1.5 py-0">
                            <ShieldCheck size={10} /> Verified Patron
                          </Badge>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < r.rating ? "#C5A059" : "none"}
                            className={i < r.rating ? "text-[#C5A059]" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-xs font-semibold text-gray-900 ml-1">{r.title}</span>
                      </div>

                      <p className="text-xs text-[#756A63] font-light leading-relaxed max-w-2xl">
                        "{r.comment}"
                      </p>

                      <p className="text-[10px] text-gray-400 font-light">
                        Submitted on {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                    {getStatusBadge(r.status)}
                    <div className="flex items-center gap-1 mt-1">
                      {r.status !== 'approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: r._id, status: 'approved' })}
                          className="text-emerald-700 hover:bg-emerald-50 text-xs h-7 px-2"
                        >
                          <Check size={13} className="mr-1" /> Approve
                        </Button>
                      )}
                      {r.status !== 'rejected' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: r._id, status: 'rejected' })}
                          className="text-red-700 hover:bg-red-50 text-xs h-7 px-2"
                        >
                          <X size={13} className="mr-1" /> Reject
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(r._id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete permanently"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
