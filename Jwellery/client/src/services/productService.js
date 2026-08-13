import api from './api';

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getFeatured: (params) => api.get('/products/featured', { params }),
  getDiamondRings: (params) => api.get('/products/diamond-rings', { params }),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/admin/${id}`),
  search: (params) => api.get('/products/search', { params }),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  toggleStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  delete: (id) => api.delete(`/products/${id}`),
};
