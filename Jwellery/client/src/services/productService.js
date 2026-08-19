import api from './api';
import { dummyProducts } from '../lib/dummyData';

export const productService = {
  // Mock implementation for frontend demo
  getProducts: async (params = {}) => {
    let filtered = [...dummyProducts];

    if (params.category) {
      filtered = filtered.filter(p => p.category && p.category._id === params.category);
    }
    
    // Some filters use 'true' (string) or true (boolean)
    if (params.isNewArrival === 'true' || params.isNewArrival === true) {
      filtered = filtered.filter(p => p.isNewArrival);
    }
    if (params.isFeatured === 'true' || params.isFeatured === true) {
      filtered = filtered.filter(p => p.isFeatured);
    }
    if (params.isBestSeller === 'true' || params.isBestSeller === true) {
      filtered = filtered.filter(p => p.isBestSeller);
    }
    if (params.isTrending === 'true' || params.isTrending === true) {
      filtered = filtered.filter(p => p.isTrending);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }

    return { data: { products: filtered, pagination: { totalPages: 1 } } };
  },
  
  getFeatured: async (params) => {
    return {
      data: {
        featured: dummyProducts.filter(p => p.isFeatured),
        newArrivals: dummyProducts.filter(p => p.isNewArrival),
        bestSellers: dummyProducts.filter(p => p.isBestSeller),
        trending: dummyProducts.filter(p => p.isTrending)
      }
    };
  },
  
  getDiamondRings: async (params) => {
    return { data: { products: dummyProducts.filter(p => p.category?.slug === 'rings') } };
  },
  
  getBySlug: async (slug) => {
    const product = dummyProducts.find(p => p.slug === slug) || dummyProducts[0];
    const related = dummyProducts.filter(p => p.category?._id === product.category?._id && p._id !== product._id);
    return {
      data: {
        product: product,
        relatedProducts: related.slice(0, 4)
      }
    };
  },
  
  search: async (params) => {
    let filtered = [...dummyProducts];
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }
    return { data: { products: filtered, count: filtered.length } };
  },
  
  // Admin routes (connected to API, may fail if no backend)
  getById: (id) => api.get(`/products/admin/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  delete: (id) => api.delete(`/products/${id}`),
};
