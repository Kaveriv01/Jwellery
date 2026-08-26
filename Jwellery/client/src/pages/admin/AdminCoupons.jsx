import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { couponService } from '../../services/otherServices';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minimumPurchase, setMinimumPurchase] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => couponService.getAll().then((r) => r.data),
  });

  const coupons = data?.coupons || [];

  const createMutation = useMutation({
    mutationFn: (body) => couponService.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon created.');
      resetForm();
    },
    onError: () => toast.error('Failed to create coupon.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => couponService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon updated.');
      resetForm();
    },
    onError: () => toast.error('Failed to update coupon.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon deleted.');
    },
    onError: () => toast.error('Failed to delete coupon.'),
  });

  const resetForm = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinimumPurchase('');
    setMaxDiscountAmount('');
    setExpiryDate('');
    setUsageLimit('');
  };

  const handleEdit = (c) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinimumPurchase(c.minimumPurchase || '');
    setMaxDiscountAmount(c.maxDiscountAmount || '');
    setExpiryDate(c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '');
    setUsageLimit(c.usageLimit || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    const payload = {
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minimumPurchase: minimumPurchase ? Number(minimumPurchase) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon._id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this coupon?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Coupons — Admin | Jwellery</title></Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-fit">
          <h2 className="font-serif text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Tag size={18} className="text-[#C5A059]" />
            {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Coupon Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="WELCOME10"
                className="input-gold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="input-gold cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Discount Value *</label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? '10' : '100'}
                  className="input-gold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Min. Purchase (₹)</label>
                <input
                  type="number"
                  value={minimumPurchase}
                  onChange={(e) => setMinimumPurchase(e.target.value)}
                  className="input-gold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Max. Discount (₹)</label>
                <input
                  type="number"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  className="input-gold"
                  disabled={discountType === 'fixed'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="input-gold cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Usage Limit</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="input-gold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 btn-gold rounded-xl py-2.5 text-xs font-semibold"
              >
                {editingCoupon ? 'Save Changes' : '✓ Add Coupon'}
              </button>
              {editingCoupon && (
                <button type="button" onClick={resetForm} className="btn-outline-gold rounded-xl py-2.5 px-4 text-xs">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <h2 className="font-serif text-xl text-gray-900 p-5 border-b border-gray-100">Coupons Directory</h2>

          {isLoading ? (
            <div className="p-5 space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl animate-pulse" />)}
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No coupons active.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <div key={c._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-800 text-sm bg-gray-100 px-2 py-0.5 rounded">{c.code}</span>
                      <span className="text-xs text-green-600 font-medium">
                        {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-gray-400">
                      {c.minimumPurchase > 0 && <span>Min: ₹{c.minimumPurchase}</span>}
                      {c.expiryDate && <span>Expires: {formatDate(c.expiryDate)}</span>}
                      {c.usedCount !== undefined && <span>Used: {c.usedCount} times</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#C5A059] transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
