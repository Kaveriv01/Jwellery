import api from './api';

const withFallback = async (apiCall, fallbackData) => {
  try {
    const response = await apiCall();
    if (!response || !response.data) throw new Error("No data");
    if (response.data.categories && response.data.categories.length === 0) {
      throw new Error("Empty array");
    }
    return response;
  } catch (error) {
    console.warn("API Error or Empty, falling back to dummy data");
    return { data: fallbackData };
  }
};

const dummyCategories = [
  { _id: 'cat1', name: 'Necklaces', slug: 'necklaces', image: { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500' } },
  { _id: 'cat2', name: 'Earrings', slug: 'earrings', image: { url: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=500' } },
  { _id: 'cat3', name: 'Rings', slug: 'rings', image: { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=500' } },
  { _id: 'cat4', name: 'Bracelets', slug: 'bracelets', image: { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500' } },
];

export const categoryService = {
  getAll: async (params) => {
    return { data: { categories: dummyCategories } };
  },
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
