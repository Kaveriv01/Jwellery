import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Upload, Trash2, Edit2, Sparkles, Gem } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/otherServices';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [customImageUrl, setCustomImageUrl] = useState('');

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
        gender: product.gender || 'Women',
        occasion: product.occasion || 'Bridal & Fine Everyday',
        isFeatured: Boolean(product.isFeatured),
        isNewArrival: Boolean(product.isNewArrival),
        isBestSeller: Boolean(product.isBestSeller),
      });
      if (product.images?.[0]?.url) {
        setCustomImageUrl(product.images[0].url);
      }
    }
  }, [product, reset]);

  const editMutation = useMutation({
    mutationFn: (formData) => productService.update(id, formData),
    onSuccess: () => {
      toast.success('Jewellery piece specifications updated live!');
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['admin-product', id]);
      navigate('/admin/products');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update product.');
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      images: customImageUrl ? [{ url: customImageUrl, isDefault: true }] : product?.images
    };
    editMutation.mutate(payload);
  };

  if (productLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Edit {product?.name || 'Piece'} — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products')}
          className="text-xs text-[#756A63] hover:text-black gap-1.5 -ml-2"
        >
          <ArrowLeft size={14} /> Back to Products
        </Button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Refine Specifications: {product?.name}
            </h1>
            <Badge variant="gold" className="text-[10px]">
              SKU: {product?.sku}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Modify metallurgy properties, retail valuations, stock availability, and imagery.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Information Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                General Nomenclature
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-gray-800">
                    Piece Name *
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="text-xs h-10 rounded-xl border-[#DED3C4]"
                  />
                  {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sku" className="text-xs font-semibold text-gray-800">
                    Vault SKU *
                  </Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    className="font-mono text-xs h-10 rounded-xl border-[#DED3C4]"
                  />
                  {errors.sku && <p className="text-[10px] text-red-500">{errors.sku.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shortDescription" className="text-xs font-semibold text-gray-800">
                  Short Tagline
                </Label>
                <Input
                  id="shortDescription"
                  {...register('shortDescription')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-gray-800">
                  Full Atelier Description *
                </Label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="w-full p-3 bg-white border border-[#DED3C4] rounded-xl text-xs outline-none focus:border-[#C5A059] resize-none"
                />
                {errors.description && <p className="text-[10px] text-red-500">{errors.description.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Valuation & Vault Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold text-gray-800">
                  Regular Price (₹) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
                {errors.price && <p className="text-[10px] text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discountPrice" className="text-xs font-semibold text-gray-800">
                  Privilege Offer Price (₹)
                </Label>
                <Input
                  id="discountPrice"
                  type="number"
                  {...register('discountPrice')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock" className="text-xs font-semibold text-gray-800">
                  Stock Units *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
                {errors.stock && <p className="text-[10px] text-red-500">{errors.stock.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Classification & Specifications */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Metallurgy & Gemmology Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-gray-800">
                  Category *
                </Label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full h-10 px-3 bg-white border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-[10px] text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="material" className="text-xs font-semibold text-gray-800">
                  Metal Material *
                </Label>
                <select
                  id="material"
                  {...register('material')}
                  className="w-full h-10 px-3 bg-white border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059]"
                >
                  <option value="18k Yellow Gold">18k Yellow Gold</option>
                  <option value="18k Rose Gold">18k Rose Gold</option>
                  <option value="18k White Gold">18k White Gold</option>
                  <option value="22k Yellow Gold">22k Yellow Gold</option>
                  <option value="950 Platinum">950 Platinum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stone" className="text-xs font-semibold text-gray-800">
                  Primary Gemstone
                </Label>
                <Input
                  id="stone"
                  {...register('stone')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="weight" className="text-xs font-semibold text-gray-800">
                  Gross Weight (Grams)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  {...register('weight')}
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Photography Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Photography & Lookbook Visuals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="custom-url" className="text-xs font-semibold text-gray-800">
                  Direct Image URL
                </Label>
                <Input
                  id="custom-url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs h-10 rounded-xl border-[#DED3C4]"
                />
              </div>

              {customImageUrl && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#DED3C4]">
                  <img src={customImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Merchandising Badges */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                Merchandising Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-wrap gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isNewArrival')} className="accent-[#C5A059] w-4 h-4" />
                <span className="font-medium text-gray-800">New In Showcase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="accent-[#C5A059] w-4 h-4" />
                <span className="font-medium text-gray-800">Editorial Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('isBestSeller')} className="accent-[#C5A059] w-4 h-4" />
                <span className="font-medium text-gray-800">Atelier Best Seller</span>
              </label>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
              className="text-xs h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editMutation.isPending}
              className="bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] font-semibold text-xs tracking-wider uppercase h-11 px-8 rounded-xl shadow-md cursor-pointer"
            >
              {editMutation.isPending ? 'Saving Changes...' : 'Save & Publish Live'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
