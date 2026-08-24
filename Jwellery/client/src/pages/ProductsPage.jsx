import { useState } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/otherServices';
import { SORT_OPTIONS, MATERIAL_OPTIONS, GENDER_OPTIONS, PRICE_RANGES } from '../constants';
import { jewelleryMedia } from '../config/mediaConfig';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  let categorySlug = slug || ''; 
  
  if (slug) {
    categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  
  if (slug && categories.length > 0) {
    const matchedCategory = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (matchedCategory) {
      categoryId = matchedCategory._id;
      categoryName = matchedCategory.name;
      categorySlug = matchedCategory.slug;
    } else {
      categoryId = '000000000000000000000000';
    }
  } else if (!slug && categoryId && categories.length > 0) {
    const matchedCategory = categories.find((c) => c._id === categoryId);
    if (matchedCategory) {
      categoryName = matchedCategory.name;
      categorySlug = matchedCategory.slug;
    }
  }

  // Simplified Banner Logic for Full Width Hero
  const getBannerData = (s, isNew) => {
    if (isNew === 'true' || window.location.pathname === '/sale') {
      return { title: 'New Arrivals', subtitle: 'Discover the latest pieces.', image: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=2000' };
    }
    if (!s || window.location.pathname === '/collections') {
      return { title: 'Collections', subtitle: 'Our finest curation.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000' };
    }
    const normalized = s.toLowerCase();
    switch (normalized) {
      case 'necklaces': return { title: 'Necklaces', subtitle: 'Timeless pieces, made to shine.', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=2000' };
      case 'earrings':  return { title: 'Earrings', subtitle: 'Elegance in every detail.', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=2000' };
      case 'rings':     return { title: 'Rings', subtitle: 'A symbol of forever.', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=2000' };
      case 'bracelets': return { title: 'Bracelets', subtitle: 'Grace on your wrist.', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000' };
      default: return { title: categoryName || 'Jewelry', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000' };
    }
  };
  const bannerData = getBannerData(categorySlug, isNewArrival);

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
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({ page: '1', sortBy: 'newest' });
  };

  const hasFilters = [categoryId, material, gender, minPrice, maxPrice, inStock, isFeatured, isTrending, isBestSeller, isNewArrival].some(Boolean);

  const goToPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentCategoryName = categoryName ? categoryName : (
    search ? `Search: ${search}` : (
      isNewArrival === 'true' ? 'New In' : (
        window.location.pathname === '/collections' ? 'Collections' : (
          window.location.pathname === '/sale' ? 'Sale' : 'All Jewelry'
        )
      )
    )
  );

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <Helmet>
        <title>{currentCategoryName} — Tarini Jewellers</title>
        <meta name="description" content="Browse our complete luxury jewelry collection." />
      </Helmet>

      {/* FULL WIDTH HERO BANNER */}
      {bannerData && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-[240px] md:h-[320px] lg:h-[450px] overflow-hidden"
        >
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={bannerData.image} 
            alt={bannerData.title} 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white text-[36px] md:text-[52px] lg:text-[68px] tracking-wide mb-3 drop-shadow-md"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {bannerData.title}
            </motion.h1>
            {bannerData.subtitle && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-white text-[12px] md:text-[14px] tracking-[0.2em] uppercase font-[400] drop-shadow-md"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {bannerData.subtitle}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}

      <div className="container-luxury py-10 lg:py-16">
        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categoryId && <FilterChip label={`Category: ${categoryName || 'Unknown'}`} onRemove={() => updateParam('category', '')} />}
            {material && <FilterChip label={`Material: ${material}`} onRemove={() => updateParam('material', '')} />}
            {gender && <FilterChip label={`Gender: ${gender}`} onRemove={() => updateParam('gender', '')} />}
            {(minPrice || maxPrice) && <FilterChip label={`₹${minPrice || 0} – ₹${maxPrice || '∞'}`} onRemove={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }} />}
            <button onClick={clearAllFilters} className="text-[11px] uppercase tracking-wider text-[#111] hover:text-[#B59A68] underline ml-2 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Clear all</button>
          </div>
        )}

        <div className="flex gap-12">
          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin pr-4">
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

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Grid Header */}
            <div className="flex items-end justify-between pb-6 mb-8 border-b border-[#EAE6DF]">
              <div className="flex items-center gap-4">
                <button onClick={() => setFilterOpen(true)} className="flex lg:hidden items-center gap-2 bg-[#111] text-white py-2 px-4 text-[11px] uppercase tracking-[0.1em] font-[500] hover:bg-[#333] transition-colors rounded-[2px]">
                  <Filter size={14} /> Filters
                </button>
                <div className="hidden lg:block">
                  <h2 className="text-[28px] font-[500] text-[#111] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {currentCategoryName}
                  </h2>
                  <p className="text-[11px] text-[#756B62] mt-3 font-[500] tracking-[0.15em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {pagination.totalItems || products.length} Products
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#756B62] uppercase tracking-[0.15em] hidden sm:block font-[500]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParam('sortBy', e.target.value)}
                    className="border-b border-[#EAE6DF] bg-transparent text-[11px] font-[600] uppercase tracking-[0.1em] cursor-pointer focus:ring-0 text-[#111] outline-none pb-1"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isLoading || isFetching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="bg-[#EAE6DF]/50 animate-pulse rounded-[2px] aspect-[4/5]" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-3xl text-[#756B62] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No jewelry found</p>
                {hasFilters ? (
                  <button onClick={clearAllFilters} className="bg-[#111] text-white text-[11px] tracking-[0.15em] uppercase px-8 py-3 hover:bg-[#B59A68] transition-colors rounded-[2px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Clear Filters
                  </button>
                ) : (
                  <p className="text-[#756B62] text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>There are currently no products available in this collection.</p>
                )}
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12"
              >
                {products.map((product) => (
                  <motion.div 
                    key={product._id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-20">
                <button disabled={!pagination.hasPrevPage} onClick={() => goToPage(page - 1)} className="px-5 py-2.5 border border-[#EAE6DF] rounded-[2px] text-[10px] uppercase tracking-[0.15em] text-[#111] hover:border-[#111] disabled:opacity-40 transition-all duration-300 font-[600]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Prev
                </button>
                {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-10 h-10 rounded-[2px] text-[12px] font-medium transition-all duration-300 ${page === pageNum ? 'bg-[#111] text-white border border-[#111]' : 'border border-[#EAE6DF] hover:border-[#111] text-[#111]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {pageNum}
                    </button>
                  );
                })}
                <button disabled={!pagination.hasNextPage} onClick={() => goToPage(page + 1)} className="px-5 py-2.5 border border-[#EAE6DF] rounded-[2px] text-[10px] uppercase tracking-[0.15em] text-[#111] hover:border-[#111] disabled:opacity-40 transition-all duration-300 font-[600]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter slide-in */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden" 
            onClick={() => setFilterOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-[#FAF6EE] overflow-y-auto p-6 shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE6DF]">
                <h2 className="text-[20px] text-[#111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="text-[#111] hover:text-[#B59A68] transition-colors"><X size={20} strokeWidth={1.5} /></button>
              </div>
              <FilterSidebar categories={categories} selectedCategory={categoryId} selectedMaterial={material} selectedGender={gender} minPrice={minPrice} maxPrice={maxPrice} inStock={inStock} onUpdate={(k, v) => { updateParam(k, v); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-2 bg-white border border-[#EAE6DF] text-[#111] text-[9px] font-[600] uppercase tracking-[0.1em] px-3 py-1.5 rounded-[2px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {label}
      <button onClick={onRemove} className="hover:text-[#B59A68] transition-colors"><X size={12} /></button>
    </span>
  );
}

function FilterSidebar({ categories, selectedCategory, selectedMaterial, selectedGender, minPrice, maxPrice, inStock, onUpdate }) {
  return (
    <div className="space-y-1">
      <FilterGroup title="Category">
        {categories.slice(0, 10).map((cat) => (
          <label key={cat._id} className="flex items-center gap-3 cursor-pointer group py-1.5">
            <div className="relative flex items-center justify-center w-3 h-3 border border-[#111] rounded-full">
              {selectedCategory === cat._id && <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />}
            </div>
            <input type="radio" name="category" checked={selectedCategory === cat._id} onChange={() => onUpdate('category', selectedCategory === cat._id ? '' : cat._id)} className="sr-only" />
            <span className={`text-[12px] transition-colors font-[400] ${selectedCategory === cat._id ? 'text-[#111] font-[500]' : 'text-[#756B62] group-hover:text-[#111]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>{cat.name}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="flex items-center gap-3 cursor-pointer group py-1.5">
            <div className="relative flex items-center justify-center w-3 h-3 border border-[#111] rounded-full">
              {(minPrice === String(range.min) && maxPrice === String(range.max)) && <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />}
            </div>
            <input type="radio" name="price" checked={minPrice === String(range.min) && maxPrice === String(range.max)} onChange={() => { onUpdate('minPrice', String(range.min)); onUpdate('maxPrice', String(range.max)); }} className="sr-only" />
            <span className={`text-[12px] transition-colors font-[400] ${(minPrice === String(range.min) && maxPrice === String(range.max)) ? 'text-[#111] font-[500]' : 'text-[#756B62] group-hover:text-[#111]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>{range.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Material">
        {MATERIAL_OPTIONS.map((mat) => (
          <label key={mat} className="flex items-center gap-3 cursor-pointer group py-1.5">
            <div className="relative flex items-center justify-center w-3 h-3 border border-[#111] rounded-full">
              {selectedMaterial === mat && <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />}
            </div>
            <input type="radio" name="material" checked={selectedMaterial === mat} onChange={() => onUpdate('material', selectedMaterial === mat ? '' : mat)} className="sr-only" />
            <span className={`text-[12px] transition-colors font-[400] ${selectedMaterial === mat ? 'text-[#111] font-[500]' : 'text-[#756B62] group-hover:text-[#111]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>{mat}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex items-center gap-3 cursor-pointer group py-1.5">
          <div className="relative flex items-center justify-center w-3 h-3 border border-[#111] rounded-[2px]">
            {inStock === 'true' && <div className="w-1.5 h-1.5 bg-[#111]" />}
          </div>
          <input type="checkbox" checked={inStock === 'true'} onChange={(e) => onUpdate('inStock', e.target.checked ? 'true' : '')} className="sr-only" />
          <span className={`text-[12px] transition-colors font-[400] ${inStock === 'true' ? 'text-[#111] font-[500]' : 'text-[#756B62] group-hover:text-[#111]'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>In Stock Only</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="pb-5 mb-5 border-b border-[#EAE6DF] last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3 group">
        <span className="text-[11px] font-[600] uppercase tracking-[0.15em] text-[#111]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{title}</span>
        <ChevronDown size={14} className={`text-[#111] transition-transform duration-300 ${open ? 'rotate-180' : ''} group-hover:text-[#B59A68]`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
