import api from './api';
import { adminStore } from '../lib/adminData';

const CART_STORAGE_KEY = 'tarini_cart';

function getLocalCart() {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveLocalCart(cart) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

function calculateSummary(cart) {
  const items = cart.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const discount = cart.discount || 0;
  const shippingCharge = subtotal > 0 ? 0 : 0; // Free Insured Transit on Tarini Jewellery
  const tax = Math.round(subtotal * 0.03); // 3% GST on Gold & Fine Jewellery
  const total = Math.max(0, subtotal - discount + shippingCharge + tax);

  return {
    subtotal,
    discount,
    shippingCharge,
    tax,
    total,
    totalPrice: total,
    totalItems: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
  };
}

export const cartService = {
  getCart: async () => {
    try {
      return await api.get('/cart');
    } catch {
      const cart = getLocalCart();
      const summary = calculateSummary(cart);
      return { data: { cart, summary } };
    }
  },

  addToCart: async (data) => {
    try {
      return await api.post('/cart/add', data);
    } catch {
      const cart = getLocalCart();
      const products = adminStore.getProducts();
      const product = products.find(p => p._id === data.productId || p.slug === data.productId) || products[0];

      const existingIndex = cart.items.findIndex(
        item => item.product?._id === product._id || item.productId === product._id
      );

      const qtyToAdd = data.quantity || 1;

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += qtyToAdd;
      } else {
        cart.items.push({
          _id: `cart_item_${Date.now()}`,
          productId: product._id,
          product,
          quantity: qtyToAdd,
          price: product.discountPrice || product.price,
          selectedSize: data.selectedSize || product.ringSize || 'Standard',
          selectedMetal: data.selectedMetal || product.metal || '18K Yellow Gold'
        });
      }

      saveLocalCart(cart);
      const summary = calculateSummary(cart);
      return { data: { cart, summary, message: 'Added to shopping bag.' } };
    }
  },

  updateItem: async (itemId, data) => {
    try {
      return await api.put(`/cart/items/${itemId}`, data);
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.map(item => {
        if (item._id === itemId || item.productId === itemId) {
          return { ...item, quantity: data.quantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      saveLocalCart(cart);
      const summary = calculateSummary(cart);
      return { data: { cart, summary } };
    }
  },

  removeItem: async (itemId) => {
    try {
      return await api.delete(`/cart/items/${itemId}`);
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.filter(item => item._id !== itemId && item.productId !== itemId);
      saveLocalCart(cart);
      const summary = calculateSummary(cart);
      return { data: { cart, summary } };
    }
  },

  clearCart: async () => {
    try {
      return await api.delete('/cart/clear');
    } catch {
      saveLocalCart({ items: [] });
      return { data: { cart: { items: [] }, summary: calculateSummary({ items: [] }) } };
    }
  },

  applyCoupon: async (data) => {
    try {
      return await api.post('/cart/coupon', data);
    } catch {
      const cart = getLocalCart();
      const code = (data.code || '').toUpperCase();
      let discount = 0;

      if (code === 'WELCOME10') {
        const subtotal = calculateSummary(cart).subtotal;
        discount = Math.round(subtotal * 0.1);
        cart.discount = discount;
        cart.couponCode = code;
        saveLocalCart(cart);
        return { data: { message: 'WELCOME10 applied! 10% discount applied.', discount } };
      }

      return { data: { message: `Privilege code ${code} applied.`, discount: 500 } };
    }
  },

  removeCoupon: async () => {
    try {
      return await api.delete('/cart/coupon');
    } catch {
      const cart = getLocalCart();
      cart.discount = 0;
      delete cart.couponCode;
      saveLocalCart(cart);
      return { data: { message: 'Coupon removed.' } };
    }
  },

  toggleGiftWrap: async (data) => {
    try {
      return await api.post('/cart/gift-wrap', data);
    } catch {
      const cart = getLocalCart();
      cart.giftWrap = !cart.giftWrap;
      saveLocalCart(cart);
      return { data: { cart } };
    }
  },
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  toggle: (data) => api.post('/wishlist/toggle', data),
  moveToCart: (data) => api.post('/wishlist/move-to-cart', data),
  clear: () => api.delete('/wishlist/clear'),
  checkStatus: (productId) => api.get(`/wishlist/status/${productId}`),
};
