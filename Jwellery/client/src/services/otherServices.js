import api from './api';

export const categoryService = {
  getAll: (params) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const reviewService = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create: (data) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  voteHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  // Admin
  getAllReviews: (params) => api.get('/reviews/admin', { params }),
  updateStatus: (id, data) => api.patch(`/reviews/admin/${id}/status`, data),
  delete: (id) => api.delete(`/reviews/admin/${id}`),
};

export const bannerService = {
  getBanners: (params) => api.get('/banners', { params }),
  getAllAdmin: () => api.get('/banners/admin'),
  create: (data) => api.post('/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/banners/${id}`),
};

export const couponService = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.patch(`/users/addresses/${id}/default`),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationsRead: () => api.patch('/users/notifications/read-all'),
  // Admin
  getAllUsers: (params) => api.get('/users/admin', { params }),
  toggleUserStatus: (id) => api.patch(`/users/admin/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/users/admin/${id}`),
};

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getRevenueChart: (params) => api.get('/analytics/revenue-chart', { params }),
  getTopProducts: (params) => api.get('/analytics/top-products', { params }),
  getTopCategories: () => api.get('/analytics/top-categories'),
  getRecentOrders: (params) => api.get('/analytics/recent-orders', { params }),
  getOrderStatusStats: () => api.get('/analytics/order-status'),
};
