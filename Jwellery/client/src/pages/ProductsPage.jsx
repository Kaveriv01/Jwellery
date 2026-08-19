import { useState, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/otherServices';
import { SORT_OPTIONS, MATERIAL_OPTIONS, GENDER_OPTIONS, PRICE_RANGES } from '../constants';
import { jewelleryMedia } from '../config/mediaConfig';

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
  let categorySlug = slug || ''; // Use slug from URL immediately
  
  if (slug) {
    // Capitalize slug as fallback name while loading
    categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  
  if (slug && categories.length > 0) {
    const matchedCategory = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (matchedCategory) {
      categoryId = matchedCategory._id;
      categoryName = matchedCategory.name;
      categorySlug = matchedCategory.slug;
    } else {
      // Slug provided but not found, ensure we don't fetch all products
      categoryId = '000000000000000000000000'; // Fake valid MongoID
    }
  } else if (!slug && categoryId && categories.length > 0) {
    const matchedCategory = categories.find((c) => c._id === categoryId);
    if (matchedCategory) {
      categoryName = matchedCategory.name;
      categorySlug = matchedCategory.slug;
    }
  }

  // Determine if we should show a banner and what image to use
  const getBannerData = (s, isNew) => {
    if (isNew === 'true' || window.location.pathname === '/sale') {
      return { type: 'single', desktop: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=1600' };
    }
    if (!s || window.location.pathname === '/collections') {
      return { type: 'single', desktop: 'https://images.unsplash.com/photo-1573408301145-b98c4af05b8e?auto=format&fit=crop&q=80&w=1600' };
    }
    const normalized = s.toLowerCase();
    switch (normalized) {
      case 'necklaces': return { type: 'single', desktop: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=1600' };
      case 'earrings':  return { type: 'single', desktop: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=1600' };
      case 'rings':     return { type: 'single', desktop: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600' };
      case 'bracelets': return { type: 'single', desktop: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1600' };
      case 'stackables':return { type: 'single', desktop: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600' };
      case 'gifts':     return { type: 'single', desktop: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600' };
      default: return null;
    }
  };
  const bannerData = getBannerData(categorySlug, isNewArrival);
  const videoBanner = categorySlug ? jewelleryMedia.collectionBanners[categorySlug.toLowerCase()] : null;

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

      <div className="bg-[#FAF6EE] py-3 mb-6">
        <div className="container-luxury">
          <div className="flex items-center text-[10px] uppercase tracking-[0.15em] text-[#756B62]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <Link to="/" className="hover:text-[#111] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-[#111] transition-colors">Collections</Link>
            {categoryName ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#111]">{categoryName}</span>
              </>
            ) : isNewArrival === 'true' ? (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#111]">New In</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-luxury pb-12">
        {/* Page Title */}
        <h1 className="text-[28px] lg:text-[34px] font-[500] tracking-wide text-[#111] uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {categoryName ? categoryName : (
            search ? `Search: ${search}` : (
              isNewArrival === 'true' ? 'New In' : (
                window.location.pathname === '/collections' ? 'Collections' : (
                  window.location.pathname === '/sale' ? 'Sale' : 'All Jewelry'
                )
              )
            )
          )}
        </h1>

        {/* Constrained Category Banner */}
        {videoBanner ? (
          <div className="mb-12 relative w-full h-[300px] md:h-[500px] overflow-hidden bg-[#EAE8E2] flex items-center justify-center">
            <video
              src={videoBanner.videoUrl}
              poster={videoBanner.poster}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center px-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#FAF6EE] font-normal mb-4 drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {categoryName || 'Collection'}
              </h2>
              <p className="text-[#FAF6EE] text-xs tracking-[0.2em] uppercase font-medium drop-shadow-sm">
                Explore our finest pieces
              </p>
            </div>
          </div>
        ) : bannerData && bannerData.type === 'lookbook' ? (
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
               {bannerData.images.map((img, idx) => (
                 <div key={idx} className={`relative overflow-hidden bg-[#EAE8E2] ${idx === 0 ? 'col-span-2 row-span-2 md:col-span-2 h-[300px] md:h-[516px]' : 'h-[146px] md:h-[250px]'}`}>
                    <img src={img} alt="Lookbook" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                 </div>
               ))}
            </div>
            <div className="text-center mt-10 mb-6">
               <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[#756B62] text-[12px] md:text-[14px] font-[500] tracking-wider mb-3 block uppercase">
                 {bannerData.subtitle}
               </span>
               <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[36px] md:text-[48px] lg:text-[64px] font-[500] leading-none mb-6 text-[#111]">
                 {bannerData.title}
               </h2>
               <button onClick={() => window.scrollBy({top: 800, behavior: 'smooth'})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-[#111] text-white text-[12px] lg:text-[13px] font-[600] tracking-[0.08em] uppercase px-8 py-3.5 hover:bg-[#B59A68] transition-colors">
                 SHOP THE COLLECTION
               </button>
            </div>
          </div>
        ) : bannerData ? (
          <div className="relative w-full h-[180px] md:h-[260px] lg:h-[320px] mb-12 overflow-hidden bg-[#EAE8E2]">
            <picture>
              {bannerData.mobile && (
                <source media="(max-width: 768px)" srcSet={bannerData.mobile} />
              )}
              <img 
                src={bannerData.desktop} 
                alt={categoryName} 
                className="w-full h-full object-cover object-[center_top] md:object-center"
              />
            </picture>
            
            {/* Optional overlay text matching mockup */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 text-right z-10 pointer-events-none">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[#111] md:text-white text-[14px] md:text-[16px] font-[400] tracking-wider mb-1 drop-shadow-sm md:drop-shadow-md">
                The right time for life
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[#111] md:text-white text-[36px] md:text-[48px] lg:text-[64px] font-[500] leading-none mb-6 drop-shadow-sm md:drop-shadow-md">
                Jewelry
              </span>
              <div className="flex justify-end pointer-events-auto">
                <button onClick={() => window.scrollBy({top: 400, behavior: 'smooth'})} style={{ fontFamily: "'Montserrat', sans-serif" }} className="bg-[#111] text-white text-[12px] lg:text-[13px] font-[600] tracking-[0.08em] uppercase px-6 py-2 hover:bg-[#333] transition-colors">
                  SEE COLLECTION
                </button>
              </div>
            </div>
            
            {/* Mobile gradient overlay for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-l from-white/60 to-transparent md:bg-none pointer-events-none" />
          </div>
        ) : null}

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] uppercase tracking-wider text-[#756B62] mr-2">Active filters:</span>
            {categoryId && <FilterChip label={`Category: ${categoryName || 'Unknown'}`} onRemove={() => updateParam('category', '')} />}
            {material && <FilterChip label={`Material: ${material}`} onRemove={() => updateParam('material', '')} />}
            {gender && <FilterChip label={`Gender: ${gender}`} onRemove={() => updateParam('gender', '')} />}
            {(minPrice || maxPrice) && <FilterChip label={`₹${minPrice || 0} – ₹${maxPrice || '∞'}`} onRemove={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }} />}
            <button onClick={clearAllFilters} className="text-[11px] uppercase tracking-wider text-[#B59A68] hover:text-[#111] underline ml-2">Clear all</button>
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

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Grid Header (Sort & View) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE8E2]">
              <div className="flex items-center gap-3 lg:hidden">
                <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 bg-[#FAF6EE] py-2 px-4 text-[10px] uppercase tracking-wider font-[600]">
                  <Filter size={14} /> Filters
                </button>
              </div>
              <div className="hidden lg:block">
                {/* Mobile only elements space */}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#777] uppercase tracking-wider hidden sm:block">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParam('sortBy', e.target.value)}
                    className="border-none bg-transparent text-[12px] font-[500] cursor-pointer focus:ring-0 text-[#111]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-[#111] text-white' : 'text-[#777] hover:bg-[#FAF6EE]'}`}>
                    <Grid3X3 size={15} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-[#111] text-white' : 'text-[#777] hover:bg-[#FAF6EE]'}`}>
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {isLoading || isFetching ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <div key={i} className={`skeleton rounded-xl ${viewMode === 'grid' ? 'aspect-[4/5]' : 'h-28'}`} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-3xl text-gray-300 mb-3">No jewelry found</p>
                {hasFilters ? (
                  <>
                    <p className="text-gray-500 mb-5">Try adjusting your filters to find what you're looking for.</p>
                    <button onClick={clearAllFilters} className="bg-[#111] text-white text-[10px] tracking-[0.1em] uppercase px-6 py-2 hover:bg-[#B59A68] transition-colors rounded-[2px]">
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 mb-5">There are currently no products available in this collection.</p>
                )}
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
              <div className="flex items-center justify-center gap-2 mt-12">
                <button disabled={!pagination.hasPrevPage} onClick={() => goToPage(page - 1)} className="px-4 py-2 border border-[#FAF6EE] rounded-[2px] text-[12px] uppercase tracking-wider text-[#3A0508] hover:border-[#B59A68] disabled:opacity-40 transition-all duration-300">
                  Previous
                </button>
                {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-9 h-9 rounded-[2px] text-[12px] font-medium transition-all duration-300 ${page === pageNum ? 'bg-[#3A0508] text-[#F7F3EA]' : 'border border-[#FAF6EE] hover:border-[#B59A68] text-[#756B62] hover:text-[#3A0508]'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button disabled={!pagination.hasNextPage} onClick={() => goToPage(page + 1)} className="px-4 py-2 border border-[#FAF6EE] rounded-[2px] text-[12px] uppercase tracking-wider text-[#3A0508] hover:border-[#B59A68] disabled:opacity-40 transition-all duration-300">
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
    <span className="flex items-center gap-1.5 bg-[#FAF6EE] border border-[#B59A68]/30 text-[#3A0508] text-[11px] font-medium tracking-wide px-3 py-1 rounded-[2px]">
      {label}
      <button onClick={onRemove} className="hover:text-[#B59A68] transition-colors"><X size={11} /></button>
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
            <input type="radio" name="category" checked={selectedCategory === cat._id} onChange={() => onUpdate('category', selectedCategory === cat._id ? '' : cat._id)} className="accent-[#3A0508]" />
            <span className="text-[13px] text-[#756B62] hover:text-[#3A0508] transition-colors font-light">{cat.name}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((range) => (
          <label key={range.label} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="price" checked={minPrice === String(range.min) && maxPrice === String(range.max)} onChange={() => { onUpdate('minPrice', String(range.min)); onUpdate('maxPrice', String(range.max)); }} className="accent-[#3A0508]" />
            <span className="text-[13px] text-[#756B62] hover:text-[#3A0508] transition-colors font-light">{range.label}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Material */}
      <FilterGroup title="Material">
        {MATERIAL_OPTIONS.map((mat) => (
          <label key={mat} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="material" checked={selectedMaterial === mat} onChange={() => onUpdate('material', selectedMaterial === mat ? '' : mat)} className="accent-[#3A0508]" />
            <span className="text-[13px] text-[#756B62] hover:text-[#3A0508] transition-colors font-light">{mat}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Gender */}
      <FilterGroup title="Gender">
        {GENDER_OPTIONS.map((gen) => (
          <label key={gen} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="gender" checked={selectedGender === gen} onChange={() => onUpdate('gender', selectedGender === gen ? '' : gen)} className="accent-[#3A0508]" />
            <span className="text-[13px] text-[#756B62] hover:text-[#3A0508] transition-colors font-light">{gen}</span>
          </label>
        ))}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStock === 'true'} onChange={(e) => onUpdate('inStock', e.target.checked ? 'true' : '')} className="accent-[#3A0508]" />
          <span className="text-[13px] text-[#756B62] hover:text-[#3A0508] transition-colors font-light">In Stock Only</span>
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="pb-6 mb-6">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-4 pb-2 border-b border-[#EAE8E2]">
        <span className="text-[12px] font-[600] uppercase tracking-[0.1em] text-[#111]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{title}</span>
        <ChevronDown size={14} className={`text-[#777] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}
