import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { categoryService } from '../../services/otherServices';
import { toast } from 'sonner';

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryService.getAll().then((r) => r.data),
  });

  const categories = data?.categories || [];

  const createMutation = useMutation({
    mutationFn: (formData) => categoryService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category created!');
      resetForm();
    },
    onError: () => toast.error('Failed to create category.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => categoryService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category updated!');
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
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setPreview(cat.image?.url || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Categories — Admin | Jwellery</title></Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-2xl p-5 border border-[#DED3C4] shadow-sm h-fit">
          <h2 className="font-serif text-xl text-gray-900 mb-4">
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Category Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-gold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-gold h-20 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Category Image</label>
              <div className="flex items-center gap-3">
                {preview && (
                  <img src={preview} alt="" className="w-12 h-12 object-cover rounded-lg border border-[#DED3C4]" />
                )}
                <label className="flex-1 border-2 border-dashed border-[#DED3C4] hover:border-[#C5A059] rounded-lg p-3 text-center cursor-pointer transition-colors bg-gray-50/50 flex items-center justify-center gap-2">
                  <Upload size={16} className="text-[#756A63]" />
                  <span className="text-xs text-[#756A63] font-medium">Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 btn-gold rounded-xl py-2.5 text-xs"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
              {editingCategory && (
                <button type="button" onClick={resetForm} className="btn-outline-gold rounded-xl py-2.5 px-4 text-xs">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DED3C4] shadow-sm overflow-hidden">
          <h2 className="font-serif text-xl text-gray-900 p-5 border-b border-[#DED3C4]">Category Directory</h2>

          {isLoading ? (
            <div className="p-5 space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-[#756A63]">No categories found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#DED3C4]"
                    />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{cat.name}</p>
                      {cat.description && <p className="text-xs text-[#756A63] line-clamp-1">{cat.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-[#756A63] hover:text-[#C5A059] transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
