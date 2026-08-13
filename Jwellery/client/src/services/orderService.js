import api from './api';

export const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrderById: (id) => api.get(`/orders/my-orders/${id}`),
  cancelOrder: (id, data) => api.post(`/orders/my-orders/${id}/cancel`, data),
  requestReturn: (id, data) => api.post(`/orders/my-orders/${id}/return`, data),
  // Admin
  getAllOrders: (params) => api.get('/orders/admin', { params }),
  updateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
};

export const paymentService = {
  createRazorpayOrder: (data) => api.post('/payments/razorpay/create-order', data),
  verifyRazorpay: (data) => api.post('/payments/razorpay/verify', data),
  createStripeIntent: (data) => api.post('/payments/stripe/create-intent', data),
  getMyPayments: () => api.get('/payments/my-payments'),
  initiateRefund: (data) => api.post('/payments/refund', data),
};
