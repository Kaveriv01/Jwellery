import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  if (typeof price !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}

export function getDiscountPercent(price, discountPrice) {
  if (!price || !discountPrice) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getProductImage(images) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return '/placeholder.jpg';
  }
  const defaultImage = images.find(img => img.isDefault);
  return defaultImage?.url || images[0]?.url || '/placeholder.jpg';
}

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200/50';
    case 'confirmed':
      return 'bg-blue-50 text-blue-700 border border-blue-200/50';
    case 'processing':
      return 'bg-purple-50 text-purple-700 border border-purple-200/50';
    case 'shipped':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200/50';
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border border-rose-200/50';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200/50';
  }
}

export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

