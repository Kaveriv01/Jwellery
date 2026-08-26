import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Shield, ChevronRight, Plus, Check } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '../services/otherServices';
import { orderService, paymentService } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import { PAYMENT_METHODS, DELIVERY_OPTIONS } from '../constants';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid mobile number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  addressType: z.enum(['home', 'work', 'other']).default('home'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const MAJOR_CITIES = [
  "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Aurangabad", "Bengaluru", "Bhopal", "Chandigarh", "Chennai", "Coimbatore", "Delhi", "Dhanbad", "Faridabad", "Ghaziabad", "Guwahati", "Gwalior", "Howrah", "Hubli-Dharwad", "Hyderabad", "Indore", "Jabalpur", "Jaipur", "Jodhpur", "Kalyan-Dombivli", "Kanpur", "Kolkata", "Kota", "Lucknow", "Ludhiana", "Madurai", "Meerut", "Mumbai", "Nagpur", "Nashik", "Navi Mumbai", "Patna", "Pimpri-Chinchwad", "Pune", "Raipur", "Rajkot", "Ranchi", "Solapur", "Srinagar", "Surat", "Thane", "Vadodara", "Varanasi", "Vasai-Virar", "Vijayawada", "Visakhapatnam"
];

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [delivery, setDelivery] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placingOrder, setPlacingOrder] = useState(false);

  const { cart, summary } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: addressData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => userService.getAddresses().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const addresses = addressData?.addresses || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const addAddressMutation = useMutation({
    mutationFn: userService.addAddress,
    onSuccess: (res) => {
      setSelectedAddress(res.data.address);
      setAddingNew(false);
    },
    onError: () => toast.error('Failed to save address.'),
  });

  const handleSaveAddress = (data) => {
    if (!isAuthenticated) {
      if (!data.email) {
        toast.error('Email is required for guest checkout');
        return;
      }
      setSelectedAddress({ ...data, _id: 'guest_address' });
      setAddingNew(false);
      return;
    }
    addAddressMutation.mutate(data);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address.'); return; }
    setPlacingOrder(true);

    try {
      const payload = {
        paymentMethod,
        deliveryOption: delivery,
        giftMessage: cart.giftMessage,
        giftWrap: cart.giftWrap,
      };
      
      if (isAuthenticated) {
        payload.shippingAddressId = selectedAddress._id;
      } else {
        payload.guestAddress = selectedAddress;
        payload.guestEmail = selectedAddress.email;
      }

      const { data: orderData } = await orderService.placeOrder(payload);

      const order = orderData.order;

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully!');
        navigate(`/order-success/${order._id}`);
        return;
      }

      if (paymentMethod === 'razorpay') {
        const { data: rzpData } = await paymentService.createRazorpayOrder({ orderId: order._id });

        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'Tarini Jewellers',
          description: `Order #${rzpData.orderNumber}`,
          image: '/favicon.ico',
          order_id: rzpData.razorpayOrderId,
          handler: async (response) => {
            try {
              await paymentService.verifyRazorpay({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order._id,
              });
              toast.success('Payment successful!');
              navigate(`/order-success/${order._id}`);
            } catch {
              toast.error('Payment verification failed.');
              navigate('/order-failure');
            }
          },
          prefill: { name: selectedAddress.fullName, contact: selectedAddress.phone },
          theme: { color: '#22181C' },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled.');
              navigate('/order-failure');
            },
          },
        };

        const Razorpay = window.Razorpay;
        if (!Razorpay) { toast.error('Razorpay SDK not loaded.'); return; }
        const rzp = new Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const deliveryCharge = delivery === 'express' ? 199 : (summary.subtotal >= 999 ? 0 : 99);
  const finalTotal = (summary.totalPrice || 0) + (delivery === 'express' ? 199 : 0) - (summary.shippingCharge > 0 ? summary.shippingCharge : 0) + deliveryCharge;

  return (
    <>
      <Helmet><title>Checkout — Tarini Jewellers</title></Helmet>
      <div className="container-luxury py-12">
        <h1 className="text-[26px] sm:text-[30px] text-[#22181C] mb-8 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-between mb-10 max-w-2xl">
          {STEPS.map((s, i) => {
            const isCompleted = i < step || (i === 0 && selectedAddress);
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isCompleted ? 'bg-[#C5A059] text-[#F7F3EA]' : i === step ? 'bg-[#22181C] text-[#F7F3EA]' : 'bg-[#FDFBF7] text-[#22181C]/60 border border-[#FDFBF7]'}`}>
                  {isCompleted ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-[12px] uppercase tracking-wider hidden sm:block ${i === step ? 'text-[#22181C] font-medium' : 'text-[#22181C]/60 font-light'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-[#FDFBF7] mx-1 sm:mx-3" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 0: Address */}
            {step === 0 && (
              <div>
                <h2 className="text-[18px] text-[#22181C] mb-4 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}><MapPin size={16} className="text-[#C5A059]" /> Delivery Address</h2>
                <div className="space-y-3 mb-4">
                  {isAuthenticated && addresses.map((addr) => (
                    <label key={addr._id} className={`block border-2 rounded-[2px] p-4 cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-[#C5A059] bg-[#FDFBF7]/30' : 'border-[#FDFBF7] hover:border-[#C5A059]/40 bg-[#FDFBF7]/5'}`}>
                      <div className="flex items-start gap-3">
                        <input type="radio" name="address" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} className="accent-[#22181C] mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#332B27] text-[13px]">{addr.fullName}</p>
                            <span className="text-[9px] uppercase bg-white border border-[#FDFBF7] text-[#22181C] px-2 py-0.5 rounded-[2px]">{addr.addressType}</span>
                            {addr.isDefault && <span className="text-[9px] uppercase text-[#C5A059] bg-[#FDFBF7] px-2 py-0.5 rounded-[2px] font-medium">Default</span>}
                          </div>
                          <p className="text-[13px] text-[#22181C] mt-1 font-light leading-relaxed">{addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-[11px] text-[#22181C]/70 mt-1">📞 {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                  
                  {!isAuthenticated && selectedAddress && (
                    <label className="block border-2 rounded-[2px] p-4 cursor-pointer transition-all border-[#C5A059] bg-[#FDFBF7]/30">
                      <div className="flex items-start gap-3">
                        <input type="radio" readOnly checked className="accent-[#22181C] mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#332B27] text-[13px]">{selectedAddress.fullName}</p>
                            <span className="text-[9px] uppercase bg-white border border-[#FDFBF7] text-[#22181C] px-2 py-0.5 rounded-[2px]">Guest</span>
                          </div>
                          <p className="text-[13px] text-[#22181C] mt-1 font-light leading-relaxed">{selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                          <p className="text-[11px] text-[#22181C]/70 mt-1">✉️ {selectedAddress.email} • 📞 {selectedAddress.phone}</p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                {(!addingNew && (isAuthenticated || !selectedAddress)) && (
                  <button onClick={() => setAddingNew(true)} className="flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-[#C5A059] hover:text-[#22181C] transition-colors">
                    <Plus size={14} /> {isAuthenticated ? 'Add New Address' : 'Enter Shipping Details'}
                  </button>
                )}

                {addingNew && (
                  <form onSubmit={handleSubmit(handleSaveAddress)} className="border border-[#FDFBF7] bg-[#FDFBF7]/10 rounded-[2px] p-5 space-y-4 mt-4">
                    <h3 className="font-normal text-[#22181C] text-[15px] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{isAuthenticated ? 'New Address' : 'Shipping Details'}</h3>
                    
                    {!isAuthenticated && (
                      <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Email Address *</label><input type="email" {...register('email')} className={`input-gold text-[13px] bg-transparent rounded-[2px] ${errors.email ? 'border-red-400' : ''}`} />{errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Full Name *</label><input {...register('fullName')} className={`input-gold text-[13px] bg-transparent rounded-[2px] ${errors.fullName ? 'border-red-400' : ''}`} />{errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}</div>
                      <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Phone *</label><input {...register('phone')} className={`input-gold text-[13px] bg-transparent rounded-[2px] ${errors.phone ? 'border-red-400' : ''}`} />{errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}</div>
                    </div>
                    <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Address Line 1 *</label><input {...register('addressLine1')} className={`input-gold text-[13px] bg-transparent rounded-[2px] ${errors.addressLine1 ? 'border-red-400' : ''}`} /></div>
                    <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Address Line 2</label><input {...register('addressLine2')} className="input-gold text-[13px] bg-transparent rounded-[2px]" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>City *</label>
                        <select {...register('city')} className={`input-gold text-[13px] bg-white w-full rounded-[2px] ${errors.city ? 'border-red-400' : ''}`}>
                          <option value="">Select City</option>
                          {MAJOR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>State *</label>
                        <select {...register('state')} className={`input-gold text-[13px] bg-white w-full rounded-[2px] ${errors.state ? 'border-red-400' : ''}`}>
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                      </div>
                      <div><label className="text-[11px] font-bold text-[#22181C] mb-1 block uppercase tracking-wide" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Pincode *</label><input {...register('pincode')} className={`input-gold text-[13px] bg-transparent rounded-[2px] ${errors.pincode ? 'border-red-400' : ''}`} /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={addAddressMutation.isPending} className="bg-[#22181C] hover:bg-[#4A0712] text-[#F7F3EA] text-[10px] font-medium uppercase tracking-[0.12em] py-2 px-4 rounded-[2px] transition-colors">{addAddressMutation.isPending ? 'Saving...' : 'Save Address'}</button>
                      <button type="button" onClick={() => setAddingNew(false)} className="text-[11px] uppercase tracking-wider text-[#22181C] hover:text-[#22181C] transition-colors">Cancel</button>
                    </div>
                  </form>
                )}

                <motion.button onClick={() => { if (!selectedAddress) { toast.error('Select an address.'); return; } setStep(1); }} disabled={!selectedAddress} className="bg-[#22181C] hover:bg-[#4A0712] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-8 mt-6 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059] disabled:opacity-50">
                  Continue to Delivery →
                </motion.button>
              </div>
            )}

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div>
                <h2 className="text-[18px] text-[#22181C] mb-4 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Delivery Option</h2>
                <div className="space-y-3 mb-6">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt.value} className={`block border-2 rounded-[2px] p-4 cursor-pointer transition-all ${delivery === opt.value ? 'border-[#C5A059] bg-[#FDFBF7]/30' : 'border-[#FDFBF7] hover:border-[#C5A059]/40 bg-[#FDFBF7]/5'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value} onChange={() => setDelivery(opt.value)} className="accent-[#22181C]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-[#332B27]">{opt.label}</p>
                            <p className="font-medium text-sm text-[#22181C]">{opt.free && summary.subtotal >= 999 ? 'FREE' : `₹${opt.price}`}</p>
                          </div>
                          <p className="text-xs text-[#22181C] mt-0.5">{opt.days}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="border border-[#FDFBF7] bg-white text-[#22181C] hover:bg-[#FDFBF7] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-colors">← Back</button>
                  <button onClick={() => setStep(2)} className="bg-[#22181C] hover:bg-[#4A0712] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-8 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059]">Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-[18px] text-[#22181C] mb-4 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}><CreditCard size={16} className="text-[#C5A059]" /> Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.value} className={`block border-2 rounded-[2px] p-4 cursor-pointer transition-all ${paymentMethod === method.value ? 'border-[#C5A059] bg-[#FDFBF7]/30' : 'border-[#FDFBF7] hover:border-[#C5A059]/40 bg-[#FDFBF7]/5'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} className="accent-[#22181C]" />
                        <div>
                          <p className="font-medium text-sm text-[#332B27]">{method.label}</p>
                          <p className="text-xs text-[#22181C] mt-0.5">{method.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#22181C] mb-6">
                  <Shield size={13} className="text-[#C5A059]" />
                  Your payment information is encrypted with 256-bit SSL.
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="border border-[#FDFBF7] bg-white text-[#22181C] hover:bg-[#FDFBF7] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-colors">← Back</button>
                  <button onClick={() => setStep(3)} className="bg-[#22181C] hover:bg-[#4A0712] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 px-8 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059]">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-[18px] text-[#22181C] mb-4 font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Review Your Order</h2>
                {/* Items summary */}
                <div className="space-y-3 mb-5">
                  {cart.items?.map((item) => (
                    <div key={item._id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-[2px] bg-[#FDFBF7] border border-[#FDFBF7] p-1 flex items-center justify-center">
                        <img src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#332B27] truncate">{item.product?.name}</p>
                        <p className="text-[11px] text-[#22181C]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[13px] font-semibold text-[#22181C]">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                {selectedAddress && (
                  <div className="bg-[#FDFBF7]/30 border border-[#FDFBF7] rounded-[2px] p-4 mb-6 text-[13px] leading-relaxed">
                    <p className="font-medium text-[#22181C] mb-1">📦 Delivery to:</p>
                    <p className="text-[#332B27]">{selectedAddress.fullName} | {selectedAddress.phone}</p>
                    <p className="text-[#22181C] font-light">{selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="border border-[#FDFBF7] bg-white text-[#22181C] hover:bg-[#FDFBF7] py-3.5 px-6 text-[11px] uppercase tracking-[0.12em] font-medium rounded-[2px] transition-colors">← Back</button>
                  <motion.button onClick={handlePlaceOrder} disabled={placingOrder} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="flex-1 bg-[#22181C] hover:bg-[#4A0712] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 rounded-[2px] transition-all border-b-2 border-transparent hover:border-[#C5A059] disabled:opacity-60">
                    {placingOrder ? 'Processing...' : paymentMethod === 'cod' ? '✓ Place Order (COD)' : '✓ Pay & Place Order'}
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-[#FDFBF7]/30 border border-[#FDFBF7] rounded-[2px] p-6 sticky top-24 space-y-4">
              <h3 className="text-[18px] text-[#22181C] font-normal tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Order Summary</h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-[#22181C]"><span>Subtotal</span><span className="font-medium text-[#332B27]">{formatPrice(summary.subtotal)}</span></div>
                {summary.couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span className="font-medium">-{formatPrice(summary.couponDiscount)}</span></div>}
                <div className="flex justify-between text-[#22181C]"><span>Shipping</span><span className="font-medium text-[#332B27]">{deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}</span></div>
                <div className="flex justify-between text-[#22181C]"><span>GST (3%)</span><span className="font-medium text-[#332B27]">{formatPrice(summary.gstAmount)}</span></div>
                <div className="flex justify-between font-normal text-[#22181C] text-base pt-3 border-t border-[#FDFBF7]">
                  <span>Total</span><span className="font-medium text-[#22181C]">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

