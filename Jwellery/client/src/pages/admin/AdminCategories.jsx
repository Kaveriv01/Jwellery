import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Upload, FolderOpen } from 'lucide-react';
import { categoryService } from '../../services/otherServices';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryService.getAll().then((r) => r.data),
  });

  const categories = data?.categories || [];

  const createMutation = useMutation({
    mutationFn: (formData) => categoryService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category created successfully!');
      resetForm();
    },
    onError: () => toast.error('Failed to create category.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => categoryService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category updated successfully!');
      resetForm();
    },
    onError: () => toast.error('Failed to update category.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category deleted.');
    },
    onError: () => toast.error('Failed to delete category.'),
  });

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.image?.url || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const payload = {
      name,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, formData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id, catName) => {
    if (window.confirm(`Delete the "${catName}" category?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Collections & Categories — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Jewellery Collections & Categories
            </h1>
            <Badge variant="gold" className="text-[10px]">
              {categories.length} Collections
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Manage high-jewellery curation taxonomies, lookbooks, and category imagery.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left, Category Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card using shadcn Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs h-fit">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                {editingCategory ? 'Edit Collection' : 'Create New Collection'}
              </CardTitle>
              <CardDescription className="text-xs text-[#756A63]">
                Define display names, descriptions, and feature lookbook visuals.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name" className="text-xs font-semibold text-gray-800">
                  Category Name
                </Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Solitaires"
                  required
                  className="h-10 text-xs rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-desc" className="text-xs font-semibold text-gray-800">
                  Editorial Description
                </Label>
                <textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the craftsmanship and stone setting..."
                  rows={3}
                  className="w-full p-3 bg-white border border-[#DED3C4] rounded-xl text-xs outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-img" className="text-xs font-semibold text-gray-800">
                  Showcase Image URL
                </Label>
                <Input
                  id="cat-img"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-10 text-xs rounded-xl border-[#DED3C4]"
                />
              </div>

              {imageUrl && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-[#DED3C4]">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] font-semibold text-xs tracking-wider uppercase h-10 rounded-xl cursor-pointer"
                >
                  {editingCategory ? 'Update Collection' : '+ Save Collection'}
                </Button>
                {editingCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="h-10 text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Existing Categories Cards on Right */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-lg text-gray-900 font-normal">Active Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Card key={cat._id} className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs hover:border-[#C5A059]/60 transition-all group flex flex-col justify-between">
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={cat.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-serif text-lg font-light">{cat.name}</p>
                      <p className="text-[10px] text-white/70 font-mono">/category/{cat.slug}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-[#756A63] line-clamp-2 font-light">
                      {cat.description || 'Curated luxury collection crafted in hallmarked gold.'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Badge variant="gold" className="text-[9px]">
                        Active Collection
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(cat)}
                          className="text-[#8C6D2D] hover:bg-amber-50"
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
