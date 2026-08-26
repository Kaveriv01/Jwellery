import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Check, X, Tag, Eye } from 'lucide-react';
import { productService } from '../../services/productService';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productService.getProducts({ page, limit, search }).then((r) => r.data),
    keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => productService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product status updated.');
    },
    onError: () => toast.error('Failed to update product status.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted.');
    },
    onError: () => toast.error('Failed to delete product.'),
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Manage Products — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, edit and update your inventory</p>
          </div>
          <Link to="/admin/products/new" className="btn-gold rounded-xl flex items-center gap-2 py-3 px-5 text-xs font-semibold w-fit">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-gold pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <Tag size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No products found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">SKU</th>
                    <th className="py-4 px-6">Stock</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-xs">{p.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{p.material} | {p.category?.name || 'Uncategorized'}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-mono text-xs">{p.sku || '-'}</td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${p.stock <= 5 ? 'text-orange-500' : 'text-gray-700'}`}>{p.stock}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">{formatPrice(p.discountPrice || p.price)}</span>
                        {p.discountPrice && (
                          <span className="text-xs text-gray-400 line-through block">{formatPrice(p.price)}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleMutation.mutate(p._id)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                            p.isActive
                              ? 'bg-green-50 text-green-600 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2 h-full">
                        <Link
                          to={`/products/${p.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                          title="View on site"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#C5A059] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
