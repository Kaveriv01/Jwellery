import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Upload, Layers, Image as ImageIcon } from 'lucide-react';
import { bannerService } from '../../services/otherServices';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [imageUrl, setImageUrl] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => bannerService.getAllAdmin().then((r) => r.data),
  });

  const banners = data?.banners || [];

  const createMutation = useMutation({
    mutationFn: (formData) => bannerService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      toast.success('Campaign banner created successfully.');
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
    setImageUrl('');
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
    setImageUrl(banner.image?.url || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    const payload = {
      title,
      subtitle,
      description,
      link: link || '/products',
      linkText: linkText || 'Explore',
      type,
      position: Number(position),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1400'
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id, formData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id, bTitle) => {
    if (window.confirm(`Delete the "${bTitle}" campaign banner?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Editorial Banners & Highlights — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Editorial Campaigns & Lookbook Banners
            </h1>
            <Badge variant="gold" className="text-[10px]">
              {banners.length} Campaigns
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Manage storefront hero slides, editorial spotlights, and promotional showcases.
          </p>
        </div>

        {/* 2-Column: Form on Left, Banners on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Card using shadcn Card */}
          <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-6 shadow-xs h-fit">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="font-serif text-lg text-gray-900 font-normal">
                {editingBanner ? 'Edit Campaign Banner' : 'Create Campaign Banner'}
              </CardTitle>
              <CardDescription className="text-xs text-[#756A63]">
                Upload high-resolution photography and call-to-actions
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="ban-title" className="text-xs font-semibold text-gray-800">
                  Headline Title
                </Label>
                <Input
                  id="ban-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tarini Bridal Symphony 2026"
                  required
                  className="text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ban-sub" className="text-xs font-semibold text-gray-800">
                  Subtitle
                </Label>
                <Input
                  id="ban-sub"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Rare Solitaires & Heritage Kundan"
                  className="text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ban-desc" className="text-xs font-semibold text-gray-800">
                  Description
                </Label>
                <textarea
                  id="ban-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short editorial copy..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#DED3C4] rounded-xl text-xs outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ban-type" className="text-xs font-semibold text-gray-800">
                    Banner Placement
                  </Label>
                  <select
                    id="ban-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059]"
                  >
                    <option value="hero">Hero Showcase</option>
                    <option value="promo">Promotional Banner</option>
                    <option value="editorial">Editorial Spotlight</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="ban-link-text" className="text-xs font-semibold text-gray-800">
                    Button Label
                  </Label>
                  <Input
                    id="ban-link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Explore Collection"
                    className="text-xs h-9 rounded-xl border-[#DED3C4]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="ban-link" className="text-xs font-semibold text-gray-800">
                  Destination Link
                </Label>
                <Input
                  id="ban-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/collections"
                  className="text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="ban-img" className="text-xs font-semibold text-gray-800">
                  Photography URL
                </Label>
                <Input
                  id="ban-img"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs h-9 rounded-xl border-[#DED3C4]"
                />
              </div>

              {imageUrl && (
                <div className="w-full h-28 rounded-xl overflow-hidden border border-[#DED3C4]">
                  <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] font-semibold text-xs tracking-wider uppercase h-10 rounded-xl cursor-pointer"
                >
                  {editingBanner ? 'Save Changes' : '+ Publish Banner'}
                </Button>
                {editingBanner && (
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

          {/* Existing Banners Showcase on Right */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-serif text-lg text-gray-900 font-normal">Active Showcases</h2>
            <div className="space-y-4">
              {banners.map((b) => (
                <Card key={b._id} className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs hover:border-[#C5A059]/60 transition-all flex flex-col md:flex-row">
                  <div className="relative md:w-56 h-36 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={b.image?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000'}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="gold" className="text-[9px] uppercase">
                          {b.type || 'Hero'}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-mono">Link: {b.link || '/products'}</span>
                      </div>
                      <h3 className="font-serif text-lg font-light text-gray-900">{b.title}</h3>
                      {b.subtitle && <p className="text-xs text-[#8C6D2D] font-medium">{b.subtitle}</p>}
                      {b.description && <p className="text-xs text-[#756A63] mt-1 font-light line-clamp-2">{b.description}</p>}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-700">CTA: "{b.linkText || 'Explore'}"</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(b)}
                          className="text-[#8C6D2D] hover:bg-amber-50"
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(b._id, b.title)}
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
