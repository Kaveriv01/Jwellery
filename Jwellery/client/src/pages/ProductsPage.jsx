import { useState, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/otherServices';
import { SORT_OPTIONS, MATERIAL_OPTIONS, GENDER_OPTIONS, PRICE_RANGES } from '../constants';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();

  // Read filters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  let categoryIdFromUrl = searchParams.get('category') || '';
  const material = searchParams.get('material') || '';
  const gender = searchParams.get('gender') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const inStock = searchParams.get('inStock') || '';
  const isFeatured = searchParams.get('isFeatured') || '';
  const isTrending = searchParams.get('isTrending') || '';
  const isBestSeller = searchParams.get('isBestSeller') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll({ active: true }).then((r) => r.data),
    staleTime: 10 * 60_000,
  });

  const categories = categoriesData?.categories || [];

  let categoryId = categoryIdFromUrl;
  let categoryName = '';
  
  if (slug && categories.length > 0) {
    const matchedCategory = categories.find((c) => c.slug === slug);
    if (matchedCategory) {
      categoryId = matchedCategory._id;
      categoryName = matchedCategory.name;
    }
  } else if (!slug && categoryId && categories.length > 0) {
    const matchedCategory = categories.find((c) => c._id === categoryId);
    if (matchedCategory) categoryName = matchedCategory.name;
  }

  const params = { page, limit: ITEMS_PER_PAGE, sortBy };
  if (search) params.search = search;
  if (categoryId) params.category = categoryId;
  if (material) params.material = material;
  if (gender) params.gender = gender;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (inStock) params.inStock = inStock;
  if (isFeatured) params.isFeatured = isFeatured;
  if (isTrending) params.isTrending = isTrending;
  if (isBestSeller) params.isBestSeller = isBestSeller;
  if (isNewArrival) params.isNewArrival = isNewArrival;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params).then((r) => r.data),
    keepPreviousData: true,
    enabled: !slug || categories.length > 0,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  const updateParam = (key, value) => {
    if (key === 'category' && slug) {
       if (value) {
         const newCat = categories.find(c => c._id === value);
         if (newCat) navigate(`/category/${newCat.slug}`);
       } else {
         navigate(`/products`);
       }
       return;
    }

    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('page', '1'); // Reset page on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({ page: '1', sortBy: 'newest' });
  };

  const hasFilters = [categoryId, material, gender, minPrice, maxPrice, inStock, isFeatured, isTrending, isBestSeller, isNewArrival].some(Boolean);

  // Pagination
  const goToPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{categoryName ? `${categoryName} Jewelry` : (search ? `Search: ${search}` : 'All Products')} — Jwellery</title>
        <meta name="description" content="Browse our complete jewelry collection — rings, necklaces, earrings, bracelets, and more." />
      </Helmet>

      <div className="container-luxury py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-gray-900">
              {categoryName ? categoryName : (search ? `Results for "${search}"` : 'All Jewelry')}
            </h1>
            {pagination.total !== undefined && (
              <p className="text-sm text-gray-500 mt-1">{pagination.total} products</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="input-gold w-auto text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* View toggle */}
            <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#c9a84c] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Grid3X3 size={16} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#c9a84c] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <List size={16} />
              </button>
            </div>
            {/* Mobile filter */}
            <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-2 btn-outline-gold py-2 px-3 text-xs rounded-lg">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-500">Active filters:</span>
            {categoryId && <FilterChip label={`Category: ${categoryName || 'Unknown'}`} onRemove={() => updateParam('category', '')} />}
            {material && <FilterChip label={`Material: ${material}`} onRemove={() => updateParam('material', '')} />}
            {gender && <FilterChip label={`Gender: ${gender}`} onRemove={() => updateParam('gender', '')} />}
            {(minPrice || maxPrice) && <FilterChip label={`₹${minPrice || 0} – ₹${maxPrice || '∞'}`} onRemove={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }} />}
            {isFeatured && <FilterChip label="Featured" onRemove={() => updateParam('isFeatured', '')} />}
            {isTrending && <FilterChip label="Trending" onRemove={() => updateParam('isTrending', '')} />}
            {isBestSeller && <FilterChip label="Best Seller" onRemove={() => updateParam('isBestSeller', '')} />}
            {isNewArrival && <FilterChip label="New Arrival" onRemove={() => updateParam('isNewArrival', '')} />}
            <button onClick={clearAllFilters} className="text-xs text-red-400 hover:text-red-600 underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <FilterSidebar
              categories={categories}
              selectedCategory={categoryId}
              selectedMaterial={material}
              selectedGender={gender}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStock={inStock}
              onUpdate={updateParam}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {isLoading || isFetching ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className={`skeleton rounded-xl ${viewMode === 'grid' ? 'aspect-[4/5]' : 'h-28'}`} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-3xl text-gray-300 mb-3">No jewelry found</p>
                <p className="text-gray-500 mb-5">Try adjusting your filters.</p>
                <button onClick={clearAllFilters} className="btn-gold rounded-lg">Clear Filters</button>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={!pagination.hasPrevPage} onClick={() => goToPage(page - 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#c9a84c] disabled:opacity-40 transition-colors">
                  Previous
                </button>
                {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === pageNum ? 'bg-[#c9a84c] text-white' : 'border border-gray-200 hover:border-[#c9a84c] text-gray-700'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button disabled={!pagination.hasNextPage} onClick={() => goToPage(page + 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#c9a84c] disabled:opacity-40 transition-colors">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setFilterOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setFilterOpen(false)}><X size={20} className="text-gray-600" /></button>
            </div>
            <FilterSidebar categories={categories} selectedCategory={categoryId} selectedMaterial={material} selectedGender={gender} minPrice={minPrice} maxPrice={maxPrice} inStock={inStock} onUpdate={(k, v) => { updateParam(k, v); }} />
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 bg-[#fdf9ee] border border-[#c9a84c]/30 text-[#c9a84c] text-xs px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove}><X size={12} /></button>
    </span>
  );
}

function FilterSidebar({ categories, selectedCategory, selectedMaterial, selectedGender, minPrice, maxPrice, inStock, onUpdate }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <FilterGroup title="Category">
        {categories.slice(0, 10).map((cat) => (
          <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" checked={selectedCategory === cat._id} onChange={() => onUpdate('category', selectedCategory === cat._id ? '' : cat._id)} className="accent-[#c9a84c]" />
            <span className="text-sm text-gray-700">{cat.name}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" checked={minPrice === String(range.min) && maxPrice === String(range.max)} onChange={() => { onUpdate('minPrice', String(range.min)); onUpdate('maxPrice', String(range.max)); }} className="accent-[#c9a84c]" />
            <span className="text-sm text-gray-700">{range.label}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Material */}
      <FilterGroup title="Material">
        {MATERIAL_OPTIONS.map((mat) => (
          <label key={mat} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="material" checked={selectedMaterial === mat} onChange={() => onUpdate('material', selectedMaterial === mat ? '' : mat)} className="accent-[#c9a84c]" />
            <span className="text-sm text-gray-700">{mat}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Gender */}
      <FilterGroup title="Gender">
        {GENDER_OPTIONS.map((gen) => (
          <label key={gen} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" checked={selectedGender === gen} onChange={() => onUpdate('gender', selectedGender === gen ? '' : gen)} className="accent-[#c9a84c]" />
            <span className="text-sm text-gray-700">{gen}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStock === 'true'} onChange={(e) => onUpdate('inStock', e.target.checked ? 'true' : '')} className="accent-[#c9a84c]" />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-800">{title}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}
