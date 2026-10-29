import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Tag, Eye, Filter, ArrowUpDown } from 'lucide-react';
import { productService } from '../../services/productService';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search, selectedCategory],
    queryFn: () => productService.getProducts({ page, limit, search, category: selectedCategory }).then((r) => r.data),
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

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you wish to decommission "${name}" from the vault?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet><title>Vault Inventory — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header with Title and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
                Vault Inventory
              </h1>
              <Badge variant="gold" className="text-[10px]">
                {products.length} Masterworks
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
              Catalogue, curate and manage high-jewellery inventory across all ateliers.
            </p>
          </div>
          <Link to="/admin/products/new">
            <Button className="bg-[#1F1517] hover:bg-[#2B0E14] text-[#C5A059] border border-[#C5A059]/40 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-sm cursor-pointer">
              <Plus size={15} /> Add New Piece
            </Button>
          </Link>
        </div>

        {/* Toolbar Card using shadcn Card */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#756A63]" />
              <Input
                type="text"
                placeholder="Search by name, SKU, or gem type..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-10 bg-gray-50/50 border-[#DED3C4] text-xs rounded-xl focus-visible:ring-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="h-10 px-3 bg-gray-50/50 border border-[#DED3C4] rounded-xl text-xs text-gray-800 outline-none focus:border-[#C5A059] cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="necklaces">Necklaces</option>
                <option value="earrings">Earrings</option>
                <option value="rings">Rings</option>
                <option value="bracelets">Bracelets</option>
                <option value="solitaires">Solitaires</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Products Table Card using shadcn Card & Table */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center">
              <Tag size={40} className="text-[#C5A059]/40 mx-auto mb-3" />
              <p className="text-gray-900 font-medium text-sm">No jewellery pieces found</p>
              <p className="text-xs text-[#756A63] mt-1 font-light">Try adjusting your search criteria or add a new piece to the collection.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jewellery Piece</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category & Material</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p._id} className="hover:bg-amber-50/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 rounded-xl border border-[#DED3C4]/60">
                            <AvatarImage src={p.images?.[0]?.url} alt={p.name} />
                            <AvatarFallback className="bg-amber-50 text-[#8C6D2D] font-bold">TJ</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 max-w-[200px]">
                            <p className="font-semibold text-gray-900 text-xs truncate">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.isFeatured && <Badge variant="gold" className="text-[9px] px-1 py-0">Featured</Badge>}
                              {p.isNewArrival && <Badge variant="secondary" className="text-[9px] px-1 py-0">New</Badge>}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[11px] text-[#756A63]">
                        {p.sku || 'TAR-1000'}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-800 text-xs">{p.category?.name || 'Uncategorized'}</p>
                        <p className="text-[11px] text-[#756A63] font-light">{p.material || '18k Gold'}</p>
                      </TableCell>
                      <TableCell>
                        {p.stock <= 5 ? (
                          <Badge variant="warning" className="text-[10px] font-bold">
                            {p.stock} low stock
                          </Badge>
                        ) : (
                          <span className="text-xs font-semibold text-gray-700">{p.stock} units</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-gray-900 text-xs">{formatPrice(p.discountPrice || p.price)}</p>
                        {p.discountPrice && (
                          <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.price)}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleMutation.mutate(p._id)}
                          className="cursor-pointer"
                        >
                          {p.isActive ? (
                            <Badge variant="success" className="cursor-pointer hover:opacity-80">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="cursor-pointer hover:opacity-80">
                              Archived
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/products/${p.slug}`} target="_blank">
                            <Button variant="ghost" size="icon-sm" className="text-gray-500 hover:text-black" title="View on customer storefront">
                              <Eye size={14} />
                            </Button>
                          </Link>
                          <Link to={`/admin/products/${p._id}/edit`}>
                            <Button variant="ghost" size="icon-sm" className="text-gray-500 hover:text-[#C5A059]" title="Edit specifications">
                              <Edit2 size={14} />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="text-gray-400 hover:text-red-600" 
                            title="Decommission piece"
                            onClick={() => handleDelete(p._id, p.name)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#DED3C4]/60 px-6 py-3.5 bg-gray-50/50">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-[#756A63] font-medium">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
