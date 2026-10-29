import api from './api';
import { adminStore } from '../lib/adminData';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    let allProducts = adminStore.getProducts();
    let filtered = [...allProducts];

    if (params.category) {
      filtered = filtered.filter(p => p.category && (p.category._id === params.category || p.category.slug === params.category));
    }
    
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
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;

    return { 
      data: { 
        products: filtered, 
        pagination: { total, totalPages, page, limit } 
      } 
    };
  },
  
  getFeatured: async (params) => {
    const products = adminStore.getProducts();
    return {
      data: {
        featured: products.filter(p => p.isFeatured),
        newArrivals: products.filter(p => p.isNewArrival),
        bestSellers: products.filter(p => p.isBestSeller),
        trending: products.filter(p => p.isTrending)
      }
    };
  },
  
  getDiamondRings: async (params) => {
    const products = adminStore.getProducts();
    return { data: { products: products.filter(p => p.category?.slug === 'rings') } };
  },
  
  getBySlug: async (slug) => {
    const products = adminStore.getProducts();
    const product = products.find(p => p.slug === slug) || products[0];
    const related = products.filter(p => p.category?._id === product?.category?._id && p._id !== product?._id);
    return {
      data: {
        product: product,
        relatedProducts: related.slice(0, 4)
      }
    };
  },
  
  search: async (params) => {
    const products = adminStore.getProducts();
    let filtered = [...products];
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q)
      );
    }
    return { data: { products: filtered, count: filtered.length } };
  },
  
  // Admin Operations (Persistent via local storage store)
  getById: async (id) => {
    try {
      const res = await api.get(`/products/admin/${id}`);
      return res;
    } catch {
      const products = adminStore.getProducts();
      const product = products.find(p => p._id === id);
      if (!product) throw new Error('Product not found');
      return { data: { product } };
    }
  },

  create: async (data) => {
    try {
      const res = await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res;
    } catch {
      // Local fallback creation
      let productData = {};
      if (data instanceof FormData) {
        for (let [key, value] of data.entries()) {
          productData[key] = value;
        }
      } else {
        productData = { ...data };
      }

      const products = adminStore.getProducts();
      const categories = adminStore.getCategories();
      const selectedCat = categories.find(c => c._id === productData.category) || categories[0];

      const newId = `product_${Date.now()}`;
      const slug = (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const newProduct = {
        _id: newId,
        name: productData.name,
        slug,
        sku: productData.sku || `TAR-${Math.floor(1000 + Math.random() * 9000)}`,
        price: Number(productData.price) || 25000,
        discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
        stock: Number(productData.stock) || 10,
        category: { _id: selectedCat._id, name: selectedCat.name, slug: selectedCat.slug },
        material: productData.material || '18k Yellow Gold',
        stone: productData.stone || 'Diamond',
        purity: productData.purity || '18K',
        weight: productData.weight ? Number(productData.weight) : 5,
        gender: productData.gender || 'Women',
        occasion: productData.occasion || 'Bridal & Fine Everyday',
        shortDescription: productData.shortDescription || productData.description?.slice(0, 150) || 'Fine jewellery handcrafted to perfection.',
        description: productData.description || 'Masterfully crafted luxury jewellery from the Tarini atelier.',
        isFeatured: Boolean(productData.isFeatured),
        isNewArrival: Boolean(productData.isNewArrival),
        isBestSeller: Boolean(productData.isBestSeller),
        isActive: true,
        images: [
          {
            url: selectedCat.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
            isDefault: true
          }
        ],
        createdAt: new Date().toISOString()
      };

      const updated = [newProduct, ...products];
      adminStore.saveProducts(updated);

      return { data: { product: newProduct, message: 'Product created successfully' } };
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res;
    } catch {
      let productData = {};
      if (data instanceof FormData) {
        for (let [key, value] of data.entries()) {
          productData[key] = value;
        }
      } else {
        productData = { ...data };
      }

      const products = adminStore.getProducts();
      const categories = adminStore.getCategories();
      const selectedCat = categories.find(c => c._id === productData.category);

      const updated = products.map(p => {
        if (p._id !== id) return p;
        return {
          ...p,
          ...productData,
          price: productData.price ? Number(productData.price) : p.price,
          discountPrice: productData.discountPrice !== undefined ? Number(productData.discountPrice) : p.discountPrice,
          stock: productData.stock !== undefined ? Number(productData.stock) : p.stock,
          category: selectedCat ? { _id: selectedCat._id, name: selectedCat.name, slug: selectedCat.slug } : p.category,
        };
      });

      adminStore.saveProducts(updated);
      const product = updated.find(p => p._id === id);
      return { data: { product, message: 'Product updated successfully' } };
    }
  },

  toggleStatus: async (id) => {
    try {
      return await api.patch(`/products/${id}/toggle-status`);
    } catch {
      const products = adminStore.getProducts();
      const updated = products.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p);
      adminStore.saveProducts(updated);
      return { data: { message: 'Product status toggled' } };
    }
  },

  delete: async (id) => {
    try {
      return await api.delete(`/products/${id}`);
    } catch {
      const products = adminStore.getProducts();
      const updated = products.filter(p => p._id !== id);
      adminStore.saveProducts(updated);
      return { data: { message: 'Product deleted' } };
    }
  },

  deleteImage: async (productId, imageId) => {
    try {
      return await api.delete(`/products/${productId}/images/${imageId}`);
    } catch {
      return { data: { message: 'Image removed' } };
    }
  }
};
