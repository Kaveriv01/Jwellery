import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  applyCoupon: (data) => api.post('/cart/coupon', data),
  removeCoupon: () => api.delete('/cart/coupon'),
  toggleGiftWrap: (data) => api.post('/cart/gift-wrap', data),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  toggle: (data) => api.post('/wishlist/toggle', data),
  moveToCart: (data) => api.post('/wishlist/move-to-cart', data),
  clear: () => api.delete('/wishlist/clear'),
  checkStatus: (productId) => api.get(`/wishlist/status/${productId}`),
};
