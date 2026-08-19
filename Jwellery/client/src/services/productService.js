import api from './api';
import { dummyProducts } from '../lib/dummyData';

export const productService = {
  // Unconditionally returning dummy products for frontend display demo
  getProducts: async (params) => {
    return { data: { products: dummyProducts, pagination: { totalPages: 1 } } };
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
    return {
      data: {
        product: dummyProducts.find(p => p.slug === slug) || dummyProducts[0],
        relatedProducts: dummyProducts.slice(0, 4)
      }
    };
  },
  search: async (params) => {
    return { data: { products: dummyProducts, count: dummyProducts.length } };
  },
  
  // Admin routes remain connected to API (though they will fail if backend is down)
  getById: (id) => api.get(`/products/admin/${id}`),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  delete: (id) => api.delete(`/products/${id}`),
};
