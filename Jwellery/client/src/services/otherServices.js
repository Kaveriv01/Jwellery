import api from './api';
import { adminStore } from '../lib/adminData';

export const categoryService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/categories', { params });
      if (res?.data?.categories?.length) return res;
      throw new Error('Empty');
    } catch {
      const categories = adminStore.getCategories();
      return { data: { categories } };
    }
  },
  getBySlug: async (slug) => {
    try {
      return await api.get(`/categories/${slug}`);
    } catch {
      const categories = adminStore.getCategories();
      const category = categories.find(c => c.slug === slug) || categories[0];
      return { data: { category } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {
      let catData = {};
      if (data instanceof FormData) {
        for (let [k, v] of data.entries()) catData[k] = v;
      } else {
        catData = { ...data };
      }
      const categories = adminStore.getCategories();
      const slug = (catData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat = {
        _id: `cat_${Date.now()}`,
        name: catData.name,
        slug,
        description: catData.description || 'Curated high jewelry collection',
        image: { url: catData.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500' },
        productCount: 0
      };
      const updated = [...categories, newCat];
      adminStore.saveCategories(updated);
      return { data: { category: newCat, message: 'Category created' } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {
      let catData = {};
      if (data instanceof FormData) {
        for (let [k, v] of data.entries()) catData[k] = v;
      } else {
        catData = { ...data };
      }
      const categories = adminStore.getCategories();
      const updated = categories.map(c => c._id === id ? { ...c, ...catData } : c);
      adminStore.saveCategories(updated);
      return { data: { category: updated.find(c => c._id === id), message: 'Category updated' } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/categories/${id}`);
    } catch {
      const categories = adminStore.getCategories();
      const updated = categories.filter(c => c._id !== id);
      adminStore.saveCategories(updated);
      return { data: { message: 'Category deleted' } };
    }
  },
};

export const reviewService = {
  getProductReviews: async (productId, params) => {
    try {
      return await api.get(`/reviews/product/${productId}`, { params });
    } catch {
      const reviews = adminStore.getReviews().filter(r => r.status === 'approved');
      return { data: { reviews, pagination: { total: reviews.length, pages: 1 } } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {
      return { data: { message: 'Review submitted for moderation.' } };
    }
  },
  voteHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  
  // Admin Operations
  getAllReviews: async (params) => {
    try {
      return await api.get('/reviews/admin', { params });
    } catch {
      let reviews = adminStore.getReviews();
      if (params?.status) {
        reviews = reviews.filter(r => r.status === params.status);
      }
      return { data: { reviews, pagination: { total: reviews.length, totalPages: 1 } } };
    }
  },
  updateStatus: async (id, data) => {
    try {
      return await api.patch(`/reviews/admin/${id}/status`, data);
    } catch {
      const reviews = adminStore.getReviews();
      const updated = reviews.map(r => r._id === id ? { ...r, status: data.status } : r);
      adminStore.saveReviews(updated);
      return { data: { message: `Review status marked as ${data.status}` } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/reviews/admin/${id}`);
    } catch {
      const reviews = adminStore.getReviews();
      const updated = reviews.filter(r => r._id !== id);
      adminStore.saveReviews(updated);
      return { data: { message: 'Review deleted' } };
    }
  },
};

export const bannerService = {
  getBanners: async (params) => {
    try {
      return await api.get('/banners', { params });
    } catch {
      const banners = adminStore.getBanners().filter(b => b.isActive);
      return { data: { banners } };
    }
  },
  getAllAdmin: async () => {
    try {
      return await api.get('/banners/admin');
    } catch {
      const banners = adminStore.getBanners();
      return { data: { banners } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {
      let banData = {};
      if (data instanceof FormData) {
        for (let [k, v] of data.entries()) banData[k] = v;
      } else {
        banData = { ...data };
      }
      const banners = adminStore.getBanners();
      const newBanner = {
        _id: `ban_${Date.now()}`,
        title: banData.title,
        subtitle: banData.subtitle,
        description: banData.description,
        link: banData.link || '/products',
        linkText: banData.linkText || 'Explore',
        type: banData.type || 'hero',
        position: Number(banData.position) || 0,
        isActive: true,
        image: { url: banData.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200' }
      };
      const updated = [...banners, newBanner];
      adminStore.saveBanners(updated);
      return { data: { banner: newBanner, message: 'Banner created' } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {
      let banData = {};
      if (data instanceof FormData) {
        for (let [k, v] of data.entries()) banData[k] = v;
      } else {
        banData = { ...data };
      }
      const banners = adminStore.getBanners();
      const updated = banners.map(b => b._id === id ? { ...b, ...banData } : b);
      adminStore.saveBanners(updated);
      return { data: { banner: updated.find(b => b._id === id), message: 'Banner updated' } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/banners/${id}`);
    } catch {
      const banners = adminStore.getBanners();
      const updated = banners.filter(b => b._id !== id);
      adminStore.saveBanners(updated);
      return { data: { message: 'Banner deleted' } };
    }
  },
};

export const couponService = {
  validate: async (data) => {
    try {
      return await api.post('/coupons/validate', data);
    } catch {
      const coupons = adminStore.getCoupons();
      const code = data?.code?.toUpperCase();
      const coupon = coupons.find(c => c.code.toUpperCase() === code && c.isActive);
      if (!coupon) throw new Error('Invalid or expired promotional code.');
      return { data: { coupon } };
    }
  },
  getAll: async () => {
    try {
      return await api.get('/coupons');
    } catch {
      const coupons = adminStore.getCoupons();
      return { data: { coupons } };
    }
  },
  create: async (data) => {
    try {
      return await api.post('/coupons', data);
    } catch {
      const coupons = adminStore.getCoupons();
      const newCoupon = {
        _id: `cpn_${Date.now()}`,
        code: data.code.toUpperCase(),
        discountType: data.discountType || 'percentage',
        discountValue: Number(data.discountValue),
        minimumPurchase: Number(data.minimumPurchase) || 0,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : 100,
        usedCount: 0,
        expiryDate: data.expiryDate || '2026-12-31',
        isActive: true
      };
      const updated = [...coupons, newCoupon];
      adminStore.saveCoupons(updated);
      return { data: { coupon: newCoupon, message: 'Coupon created' } };
    }
  },
  update: async (id, data) => {
    try {
      return await api.put(`/coupons/${id}`, data);
    } catch {
      const coupons = adminStore.getCoupons();
      const updated = coupons.map(c => c._id === id ? { ...c, ...data, code: data.code?.toUpperCase() || c.code } : c);
      adminStore.saveCoupons(updated);
      return { data: { coupon: updated.find(c => c._id === id), message: 'Coupon updated' } };
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/coupons/${id}`);
    } catch {
      const coupons = adminStore.getCoupons();
      const updated = coupons.filter(c => c._id !== id);
      adminStore.saveCoupons(updated);
      return { data: { message: 'Coupon deleted' } };
    }
  },
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
  
  // Admin Operations
  getAllUsers: async (params) => {
    try {
      return await api.get('/users/admin', { params });
    } catch {
      let customers = adminStore.getCustomers();
      if (params?.search) {
        const q = params.search.toLowerCase();
        customers = customers.filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.email.toLowerCase().includes(q) ||
          c.phone?.includes(q)
        );
      }
      return { data: { users: customers, pagination: { total: customers.length, totalPages: 1 } } };
    }
  },
  toggleUserStatus: async (id) => {
    try {
      return await api.patch(`/users/admin/${id}/toggle-status`);
    } catch {
      const customers = adminStore.getCustomers();
      const updated = customers.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c);
      adminStore.saveCustomers(updated);
      const user = updated.find(c => c._id === id);
      return { data: { message: `User status changed to ${user.isActive ? 'Active' : 'Suspended'}` } };
    }
  },
  deleteUser: async (id) => {
    try {
      return await api.delete(`/users/admin/${id}`);
    } catch {
      const customers = adminStore.getCustomers();
      const updated = customers.filter(c => c._id !== id);
      adminStore.saveCustomers(updated);
      return { data: { message: 'Customer removed' } };
    }
  },
};

export const analyticsService = {
  getDashboardStats: async () => {
    try {
      return await api.get('/analytics/dashboard');
    } catch {
      const analytics = adminStore.getAnalytics();
      return { data: { stats: analytics.stats } };
    }
  },
  getRevenueChart: async (params) => {
    try {
      return await api.get('/analytics/revenue-chart', { params });
    } catch {
      const analytics = adminStore.getAnalytics();
      return { data: { chart: analytics.revenueChart } };
    }
  },
  getTopProducts: async (params) => {
    try {
      return await api.get('/analytics/top-products', { params });
    } catch {
      const products = adminStore.getProducts().slice(0, 5);
      return { data: { products } };
    }
  },
  getTopCategories: async () => {
    try {
      return await api.get('/analytics/top-categories');
    } catch {
      const analytics = adminStore.getAnalytics();
      return { data: { categories: analytics.topCategories } };
    }
  },
  getRecentOrders: async (params) => {
    try {
      return await api.get('/analytics/recent-orders', { params });
    } catch {
      const orders = adminStore.getOrders().slice(0, params?.limit || 6);
      return { data: { orders } };
    }
  },
  getOrderStatusStats: async () => {
    try {
      return await api.get('/analytics/order-status');
    } catch {
      const analytics = adminStore.getAnalytics();
      return { data: { statusStats: analytics.orderStatus } };
    }
  },
};
