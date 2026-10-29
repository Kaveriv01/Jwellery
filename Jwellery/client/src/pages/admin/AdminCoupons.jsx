import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Tag, Percent, Sparkles } from 'lucide-react';
import { couponService } from '../../services/otherServices';
import { formatDate, formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

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
      toast.success('Promotional code created successfully.');
      resetForm();
    },
    onError: () => toast.error('Failed to create coupon.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => couponService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Promotional code updated.');
      resetForm();
    },
    onError: () => toast.error('Failed to update coupon.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon removed.');
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
    setExpiryDate(c.expiryDate ? c.expiryDate.split('T')[0] : '');
    setUsageLimit(c.usageLimit || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) {
      toast.error('Code and discount value are required');
      return;
    }

    const payload = {
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minimumPurchase: minimumPurchase ? Number(minimumPurchase) : 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      expiryDate: expiryDate || '2026-12-31',
      usageLimit: usageLimit ? Number(usageLimit) : 100,
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon._id, body: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id, cCode) => {
    if (window.confirm(`Delete the "${cCode}" coupon?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Privilege Vouchers & Codes — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Privilege Codes & Special Concessions
            </h1>
            <Badge variant="gold" className="text-[10px]">
              {coupons.length} Vouchers
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Issue bridal gift vouchers, seasonal privileges, and high-jewellery promotions.
          </p>
        </div>

        {/* 2-Column: Form on Left, Table on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card using shadcn Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs h-fit">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                {editingCoupon ? 'Modify Privilege Voucher' : 'Issue New Voucher'}
              </CardTitle>
              <CardDescription className="text-xs text-[#756A63]">
                Set concession percentages or flat rate deductions
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="cpn-code" className="text-xs font-semibold text-gray-800">
                  Promotional Code
                </Label>
                <Input
                  id="cpn-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ROYALWEDDING25"
                  required
                  className="font-mono uppercase text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="disc-type" className="text-xs font-semibold text-gray-800">
                    Type
                  </Label>
                  <select
                    id="disc-type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="disc-val" className="text-xs font-semibold text-gray-800">
                    Value
                  </Label>
                  <Input
                    id="disc-val"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? '15%' : '5000'}
                    required
                    className="text-xs h-9 rounded-xl border-[#DED3C4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="min-pur" className="text-xs font-semibold text-gray-800">
                    Min Acquisition (₹)
                  </Label>
                  <Input
                    id="min-pur"
                    type="number"
                    value={minimumPurchase}
                    onChange={(e) => setMinimumPurchase(e.target.value)}
                    placeholder="50000"
                    className="text-xs h-9 rounded-xl border-[#DED3C4]"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="max-disc" className="text-xs font-semibold text-gray-800">
                    Max Deduction (₹)
                  </Label>
                  <Input
                    id="max-disc"
                    type="number"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    placeholder="15000"
                    className="text-xs h-9 rounded-xl border-[#DED3C4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="exp-date" className="text-xs font-semibold text-gray-800">
                  Expiry Date
                </Label>
                <Input
                  id="exp-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] font-semibold text-xs tracking-wider uppercase h-10 rounded-xl cursor-pointer"
                >
                  {editingCoupon ? 'Save Changes' : '+ Issue Voucher'}
                </Button>
                {editingCoupon && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="h-10 text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Existing Coupons Table on Right */}
          <Card className="lg:col-span-2 border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs h-fit">
            <CardHeader className="p-5 pb-3 border-b border-gray-100">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Active Privilege Vouchers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Concession</TableHead>
                    <TableHead>Min Spend</TableHead>
                    <TableHead>Redeemed</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((c) => (
                    <TableRow key={c._id} className="hover:bg-amber-50/20">
                      <TableCell>
                        <Badge variant="gold" className="font-mono text-xs tracking-wider">
                          {c.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-xs text-gray-900">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue?.toLocaleString()} OFF`}
                      </TableCell>
                      <TableCell className="text-xs text-[#756A63]">
                        {c.minimumPurchase ? formatPrice(c.minimumPurchase) : 'No Minimum'}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 font-medium">
                        {c.usedCount || 0} / {c.usageLimit || 100}
                      </TableCell>
                      <TableCell className="text-xs text-[#756A63]">
                        {c.expiryDate ? formatDate(c.expiryDate) : 'Ongoing'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(c)}
                            className="text-[#8C6D2D] hover:bg-amber-50"
                          >
                            <Edit2 size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(c._id, c.code)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
