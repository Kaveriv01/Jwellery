import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Upload, Link as LinkIcon, Layers } from 'lucide-react';
import { bannerService } from '../../services/otherServices';
import { toast } from 'sonner';

export default function AdminBanners() {
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [linkText, setLinkText] = useState('');
  const [type, setType] = useState('hero');
  const [position, setPosition] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => bannerService.getAllAdmin().then((r) => r.data),
  });

  const banners = data?.banners || [];

  const createMutation = useMutation({
    mutationFn: (formData) => bannerService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      toast.success('Banner created successfully.');
      resetForm();
    },
    onError: () => toast.error('Failed to create banner.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => bannerService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      toast.success('Banner updated.');
      resetForm();
    },
    onError: () => toast.error('Failed to update banner.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      toast.success('Banner deleted.');
    },
    onError: () => toast.error('Failed to delete banner.'),
  });

  const resetForm = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setLink('');
    setLinkText('');
    setType('hero');
    setPosition(0);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setDescription(banner.description || '');
    setLink(banner.link || '');
    setLinkText(banner.linkText || '');
    setType(banner.type || 'hero');
    setPosition(banner.position || 0);
    setImagePreview(banner.image?.url || null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingBanner && !imageFile) {
      toast.error('Image file is required for new banners.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('linkText', linkText);
    formData.append('type', type);
    formData.append('position', position);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Banners & Promo — Admin | Jwellery</title></Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-2xl p-5 border border-[#DED3C4] shadow-sm h-fit">
          <h2 className="font-serif text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#C5A059]" />
            {editingBanner ? 'Edit Banner' : 'Create Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Banner Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-gold cursor-pointer">
                <option value="hero">Hero Slider (Home)</option>
                <option value="offer">Promo/Offer Split</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="input-gold" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-gold h-16 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Link Path / URL</label>
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/category/rings" className="input-gold" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Link CTA Text</label>
                <input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Shop Now" className="input-gold" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Position (sorting)</label>
              <input type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} className="input-gold" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Banner Image</label>
              <div className="flex items-center gap-3">
                {imagePreview && (
                  <img src={imagePreview} alt="" className="w-12 h-12 object-cover rounded-lg border border-[#DED3C4]" />
                )}
                <label className="flex-1 border-2 border-dashed border-[#DED3C4] hover:border-[#C5A059] rounded-lg p-3 text-center cursor-pointer transition-colors bg-gray-50/50 flex items-center justify-center gap-2">
                  <Upload size={16} className="text-[#756A63]" />
                  <span className="text-xs text-[#756A63] font-medium">Upload File</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 btn-gold rounded-xl py-2.5 text-xs font-semibold"
              >
                {editingBanner ? 'Save Changes' : '✓ Create Banner'}
              </button>
              {editingBanner && (
                <button type="button" onClick={resetForm} className="btn-outline-gold rounded-xl py-2.5 px-4 text-xs">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DED3C4] shadow-sm overflow-hidden">
          <h2 className="font-serif text-xl text-gray-900 p-5 border-b border-[#DED3C4]">Banners Directory</h2>

          {isLoading ? (
            <div className="p-5 space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl animate-pulse" />)}
            </div>
          ) : banners.length === 0 ? (
            <div className="p-10 text-center text-[#756A63]">No banners found.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {banners.map((b) => (
                <div key={b._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={b.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'}
                      alt={b.title}
                      className="w-16 h-10 object-cover rounded-lg border border-[#DED3C4]"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{b.title || 'Untitled Banner'}</p>
                      <p className="text-xs text-[#756A63] capitalize">{b.type} | Position: {b.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-[#756A63] hover:text-[#C5A059] transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
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
