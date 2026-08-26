import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/otherServices';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(3, 'Product name is required'),
  sku: z.string().min(3, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200).optional(),
  price: z.preprocess((v) => Number(v), z.number().min(1, 'Price must be positive')),
  discountPrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0).optional()),
  stock: z.preprocess((v) => Number(v), z.number().min(0, 'Stock cannot be negative')),
  category: z.string().min(1, 'Please select a category'),
  material: z.string().min(1, 'Select material'),
  purity: z.string().optional(),
  weight: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().optional()),
  stone: z.string().optional(),
  gender: z.string().optional(),
  occasion: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => productService.getById(id).then((r) => r.data),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then((r) => r.data),
  });

  const categories = catData?.categories || [];
  const product = productData?.product;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription || '',
        price: product.price,
        discountPrice: product.discountPrice || '',
        stock: product.stock,
        category: product.category?._id || product.category || '',
        material: product.material,
        purity: product.purity || '',
        weight: product.weight || '',
        stone: product.stone || '',
        gender: product.gender || '',
        occasion: product.occasion || '',
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        isBestSeller: product.isBestSeller || false,
      });
      setExistingImages(product.images || []);
    }
  }, [product, reset]);

  const editMutation = useMutation({
    mutationFn: (formData) => productService.update(id, formData),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries(['admin-products']);
      navigate('/admin/products');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update product.');
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const deleteExistingImageMutation = useMutation({
    mutationFn: (imageId) => productService.deleteImage(id, imageId),
    onSuccess: (_, imageId) => {
      setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
      toast.success('Image deleted from Cloudinary.');
    },
    onError: () => toast.error('Failed to delete image.'),
  });

  const handleRemoveExisting = (imageId) => {
    if (window.confirm('Delete this image permanently from database?')) {
      deleteExistingImageMutation.mutate(imageId);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    editMutation.mutate(formData);
  };

  if (productLoading) {
    return (
      <div className="container-luxury py-12">
        <div className="skeleton h-96 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Edit Product — Admin | Jwellery</title></Helmet>

      <div className="space-y-6 max-w-4xl">
        <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft size={16} /> Back to Products
        </button>

        <div>
          <h1 className="font-serif text-3xl text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">Modify and update specifications of "{product?.name}"</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-gray-100 pb-3">Product Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Product Name *</label>
                <input {...register('name')} className={`input-gold ${errors.name ? 'border-red-400' : ''}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">SKU *</label>
                <input {...register('sku')} className={`input-gold ${errors.sku ? 'border-red-400' : ''}`} />
                {errors.sku && <p className="text-red-400 text-xs mt-1">{errors.sku.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Short Description</label>
                <input {...register('shortDescription')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Category *</label>
                <select {...register('category')} className="input-gold">
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Description *</label>
              <textarea {...register('description')} className="input-gold h-32 resize-none" />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-gray-100 pb-3">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Original Price (₹) *</label>
                <input type="number" {...register('price')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Discount Price (₹)</label>
                <input type="number" {...register('discountPrice')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Stock Count *</label>
                <input type="number" {...register('stock')} className="input-gold" />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-gray-100 pb-3">Specifications & Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Material *</label>
                <input {...register('material')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Purity</label>
                <input {...register('purity')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Weight (g)</label>
                <input type="number" step="0.01" {...register('weight')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Stone</label>
                <input {...register('stone')} className="input-gold" />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="accent-[#C5A059] h-4 w-4" />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isNewArrival')} className="accent-[#C5A059] h-4 w-4" />
                <span className="text-sm font-medium text-gray-700">New Arrival</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isBestSeller')} className="accent-[#C5A059] h-4 w-4" />
                <span className="text-sm font-medium text-gray-700">Best Seller</span>
              </label>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-gray-100 pb-3">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Existing Images</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                  {existingImages.map((img) => (
                    <div key={img._id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(img._id)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Upload New Images</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#C5A059] flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50">
                  <Upload size={20} className="text-gray-400 mb-1" />
                  <span className="text-[10px] text-gray-500 font-medium">Upload Image</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={editMutation.isPending}
              className="btn-gold rounded-xl py-3 px-8 text-sm"
            >
              {editMutation.isPending ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-outline-gold rounded-xl py-3 px-8 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
