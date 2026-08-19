import api from './api';
import { dummyProducts } from '../lib/dummyData';

// Helper to wrap API calls with a fallback to dummy data
const withFallback = async (apiCall, fallbackData) => {
  try {
    const response = await apiCall();
    if (!response || !response.data) throw new Error("No data");
    // Also fallback if products array is empty, for the sake of frontend demo
    if (response.data.products && response.data.products.length === 0) {
      throw new Error("Empty array");
    }
    return response;
  } catch (error) {
    console.warn("API Error or Empty, falling back to dummy data");
    return { data: fallbackData };
  }
};

export const productService = {
  getProducts: (params) => withFallback(
    () => api.get('/products', { params }),
    { products: dummyProducts, pagination: { totalPages: 1 } }
  ),
  getFeatured: (params) => withFallback(
    () => api.get('/products/featured', { params }),
    { 
      featured: dummyProducts.filter(p => p.isFeatured),
      newArrivals: dummyProducts.filter(p => p.isNewArrival),
      bestSellers: dummyProducts.filter(p => p.isBestSeller),
      trending: dummyProducts.filter(p => p.isTrending)
    }
  ),
  getDiamondRings: (params) => withFallback(
    () => api.get('/products/diamond-rings', { params }),
    { products: dummyProducts.filter(p => p.category?.slug === 'rings') }
  ),
  getBySlug: (slug) => withFallback(
    () => api.get(`/products/slug/${slug}`),
    { 
      product: dummyProducts.find(p => p.slug === slug) || dummyProducts[0],
      relatedProducts: dummyProducts.slice(0, 4)
    }
  ),
  getById: (id) => api.get(`/products/admin/${id}`),
  search: (params) => withFallback(
    () => api.get('/products/search', { params }),
    { products: dummyProducts, count: dummyProducts.length }
  ),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  delete: (id) => api.delete(`/products/${id}`),
};
