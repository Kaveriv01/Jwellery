import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Upload, Plus, Trash2, Check } from 'lucide-react';
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

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then((r) => r.data),
  });

  const categories = catData?.categories || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isFeatured: false, isNewArrival: false, isBestSeller: false },
  });

  const addMutation = useMutation({
    mutationFn: (formData) => productService.create(formData),
    onSuccess: () => {
      toast.success('Product created successfully!');
      navigate('/admin/products');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to create product.');
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (data) => {
    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    addMutation.mutate(formData);
  };

  return (
    <>
      <Helmet><title>Add New Product — Admin | Jwellery</title></Helmet>

      <div className="space-y-6 max-w-4xl">
        <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-sm text-[#756A63] hover:text-gray-800">
          <ArrowLeft size={16} /> Back to Products
        </button>

        <div>
          <h1 className="font-serif text-3xl text-gray-900">Add New Product</h1>
          <p className="text-sm text-[#756A63] mt-1">Create a new jewelry piece in your store catalog</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DED3C4] space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-[#DED3C4] pb-3">Product Details</h2>
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
                <select {...register('category')} className={`input-gold ${errors.category ? 'border-red-400' : ''}`}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Description *</label>
              <textarea {...register('description')} className={`input-gold h-32 resize-none ${errors.description ? 'border-red-400' : ''}`} />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DED3C4] space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-[#DED3C4] pb-3">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Original Price (₹) *</label>
                <input type="number" {...register('price')} className={`input-gold ${errors.price ? 'border-red-400' : ''}`} />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Discount Price (₹)</label>
                <input type="number" {...register('discountPrice')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Stock Count *</label>
                <input type="number" {...register('stock')} className={`input-gold ${errors.stock ? 'border-red-400' : ''}`} />
                {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DED3C4] space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-[#DED3C4] pb-3">Specifications & Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Material *</label>
                <input {...register('material')} placeholder="e.g. Gold" className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Purity</label>
                <input {...register('purity')} placeholder="e.g. 18K / 925" className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Weight (g)</label>
                <input type="number" step="0.01" {...register('weight')} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Stone</label>
                <input {...register('stone')} placeholder="e.g. Diamond" className="input-gold" />
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DED3C4] space-y-4">
            <h2 className="font-semibold text-gray-850 text-base border-b border-[#DED3C4] pb-3">Product Images *</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#DED3C4] group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-[#3E2024]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-[#DED3C4] hover:border-[#C5A059] flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50">
                <Upload size={20} className="text-[#756A63] mb-1" />
                <span className="text-[10px] text-[#756A63] font-medium">Upload Image</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              type="submit"
              disabled={addMutation.isPending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-gold rounded-xl py-3 px-8 text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {addMutation.isPending ? 'Saving...' : '✓ Create Product'}
            </motion.button>
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
