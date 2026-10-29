import api from './api';
import { adminStore } from '../lib/adminData';

export const orderService = {
  placeOrder: async (data) => {
    try {
      return await api.post('/orders', data);
    } catch {
      const orders = adminStore.getOrders();
      const newOrder = {
        _id: `ord_${Date.now()}`,
        orderNumber: `TRN-${Math.floor(8000 + Math.random() * 2000)}`,
        user: { _id: 'cust_curr', name: 'Valued Customer', email: 'customer@jwellery.com' },
        items: data.items || [],
        totalAmount: data.totalAmount || 50000,
        shippingAmount: 0,
        discountAmount: data.discountAmount || 0,
        finalAmount: data.finalAmount || data.totalAmount || 50000,
        status: 'placed',
        paymentStatus: 'paid',
        paymentMethod: data.paymentMethod || 'Online Payment',
        shippingAddress: data.shippingAddress || {
          street: 'Bespoke Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India'
        },
        trackingNumber: `TRN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString()
      };
      adminStore.saveOrders([newOrder, ...orders]);
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

  cancelOrder: (id, data) => api.post(`/orders/my-orders/${id}/cancel`, data),
  requestReturn: (id, data) => api.post(`/orders/my-orders/${id}/return`, data),

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
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpay: (data) => api.post('/payments/razorpay/verify', data),
  createStripeIntent: (data) => api.post('/payments/stripe/create-intent', data),
  getMyPayments: () => api.get('/payments/my-payments'),
  initiateRefund: (data) => api.post('/payments/refund', data),
};
