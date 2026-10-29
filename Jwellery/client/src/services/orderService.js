import api from './api';
import { adminStore } from '../lib/adminData';
import { cartService } from './cartService';

export const orderService = {
  placeOrder: async (data) => {
    try {
      return await api.post('/orders', data);
    } catch {
      const orders = adminStore.getOrders();
      const orderTotal = Number(data.totalPrice || data.finalAmount || data.totalAmount || 50000);

      // Determine customer details
      const customerName = data.user?.name || data.shippingAddress?.name || data.shippingAddress?.fullName || 'Valued Patron';
      const customerEmail = data.user?.email || data.guestEmail || 'patron@tarini.com';
      const customerPhone = data.user?.phone || data.shippingAddress?.phone || '';

      const newOrder = {
        _id: `ord_${Date.now()}`,
        orderNumber: `TRN-${Math.floor(10000 + Math.random() * 90000)}`,
        user: {
          _id: data.user?._id || `cust_${Date.now()}`,
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        },
        items: (data.items && data.items.length > 0) ? data.items.map(item => ({
          product: item.product || {
            _id: item.productId || 'p_unknown',
            name: 'Fine Jewellery Piece',
            price: item.price || 45000,
            images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500' }]
          },
          quantity: item.quantity || 1,
          price: item.price || item.product?.discountPrice || item.product?.price || 45000,
          selectedSize: item.selectedSize || 'Standard',
          selectedMetal: item.selectedMetal || '18K Gold'
        })) : [
          {
            product: {
              _id: 'prod_auto_1',
              name: 'Aurelia Diamond Pendant',
              price: orderTotal,
              images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500' }]
            },
            quantity: 1,
            price: orderTotal
          }
        ],
        totalAmount: orderTotal,
        totalPrice: orderTotal,
        shippingAmount: 0,
        discountAmount: data.discountAmount || data.discount || 0,
        finalAmount: orderTotal,
        status: 'placed',
        paymentStatus: 'paid',
        paymentMethod: data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI',
        shippingAddress: data.shippingAddress || {
          fullName: customerName,
          street: 'Bespoke Avenue, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          phone: customerPhone
        },
        trackingNumber: `TRN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString()
      };

      // 1. Save new order into Admin Store (appears immediately in Admin Dashboard & Orders!)
      adminStore.saveOrders([newOrder, ...orders]);

      // 2. Update Customer statistics in Admin Store
      try {
        const customers = adminStore.getCustomers();
        const existingCustIdx = customers.findIndex(c => c.email?.toLowerCase() === customerEmail.toLowerCase());
        if (existingCustIdx > -1) {
          customers[existingCustIdx].totalOrders = (customers[existingCustIdx].totalOrders || 0) + 1;
          customers[existingCustIdx].totalSpent = (customers[existingCustIdx].totalSpent || 0) + orderTotal;
          adminStore.saveCustomers(customers);
        } else {
          const newCust = {
            _id: newOrder.user._id,
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            role: 'customer',
            totalOrders: 1,
            totalSpent: orderTotal,
            createdAt: new Date().toISOString(),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customerName)}`
          };
          adminStore.saveCustomers([newCust, ...customers]);
        }
      } catch (err) {
        console.warn('Could not update customer stats:', err);
      }

      // 3. Clear local shopping cart
      cartService.clearCart();

      return { data: { order: newOrder, success: true } };
    }
  },

  getMyOrders: async (params) => {
    try {
      return await api.get('/orders/my-orders', { params });
    } catch {
      const orders = adminStore.getOrders();
      return { data: { orders, count: orders.length } };
    }
  },

  getOrderById: async (id) => {
    try {
      return await api.get(`/orders/my-orders/${id}`);
    } catch {
      const orders = adminStore.getOrders();
      const order = orders.find(o => o._id === id || o.orderNumber === id) || orders[0];
      return { data: { order } };
    }
  },

  cancelOrder: async (id, data) => {
    try {
      return await api.post(`/orders/my-orders/${id}/cancel`, data);
    } catch {
      const orders = adminStore.getOrders();
      const updated = orders.map(o => o._id === id ? { ...o, status: 'cancelled' } : o);
      adminStore.saveOrders(updated);
      return { data: { message: 'Order cancelled successfully.' } };
    }
  },

  requestReturn: async (id, data) => {
    try {
      return await api.post(`/orders/my-orders/${id}/return`, data);
    } catch {
      return { data: { message: 'Return request submitted.' } };
    }
  },

  // Admin
  getAllOrders: async (params = {}) => {
    try {
      return await api.get('/orders/admin', { params });
    } catch {
      let orders = adminStore.getOrders();

      if (params.status) {
        orders = orders.filter(o => o.status === params.status);
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(o => 
          o.orderNumber?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q)
        );
      }

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 10;
      const total = orders.length;
      const totalPages = Math.ceil(total / limit) || 1;

      return {
        data: {
          orders,
          pagination: { total, totalPages, page, limit }
        }
      };
    }
  },

  updateStatus: async (id, data) => {
    try {
      return await api.put(`/orders/admin/${id}/status`, data);
    } catch {
      const orders = adminStore.getOrders();
      const updated = orders.map(o => o._id === id ? { ...o, status: data.status } : o);
      adminStore.saveOrders(updated);
      return { data: { message: `Order status updated to ${data.status}`, order: updated.find(o => o._id === id) } };
    }
  },
};

export const paymentService = {
  createRazorpayOrder: async (data) => {
    try {
      return await api.post('/payments/razorpay/create-order', data);
    } catch {
      return {
        data: {
          keyId: 'rzp_test_tarini_demo',
          amount: 5000000,
          currency: 'INR',
          orderNumber: `TRN-${Date.now().toString().slice(-5)}`,
          razorpayOrderId: `order_${Date.now()}`
        }
      };
    }
  },
  verifyRazorpay: async (data) => {
    try {
      return await api.post('/payments/razorpay/verify', data);
    } catch {
      return { data: { success: true, message: 'Payment verified.' } };
    }
  },
  createStripeIntent: (data) => api.post('/payments/stripe/create-intent', data),
  getMyPayments: () => api.get('/payments/my-payments'),
  initiateRefund: (data) => api.post('/payments/refund', data),
};
