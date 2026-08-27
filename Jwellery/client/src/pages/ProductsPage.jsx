import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Filter, X } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { categoryService } from '../services/otherServices';
import { SORT_OPTIONS, MATERIAL_OPTIONS, GENDER_OPTIONS, PRICE_RANGES } from '../constants';

const ITEMS_PER_PAGE = 48;

// Reusable Dropdown for Horizontal Filters
function HorizontalDropdown({ title, value, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = Array.isArray(value) ? value.length > 0 : !!value;
  const activeLabel = options.find(o => o.checked)?.label;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 py-2 px-3.5 text-[14px] font-[400] transition-colors rounded-[2px] ${hasSelection || isOpen ? 'text-[#111] bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-[#111]'}`}
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {hasSelection ? (activeLabel || title) : title} 
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] min-w-[220px] z-50 py-2 rounded-[2px]"
          >
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
              {options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 border border-gray-300 rounded-[2px] group-hover:border-[#111] transition-colors">
                    {opt.checked && (
                      <div className="absolute inset-0 bg-[#E8345E] border-[#E8345E] flex items-center justify-center rounded-[2px]">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <input type="checkbox" checked={opt.checked} onChange={() => { opt.onChange(); setIsOpen(false); }} className="sr-only" />
                  <span className={`text-[14px] transition-colors ${opt.checked ? 'text-[#111] font-[500]' : 'text-gray-600 group-hover:text-[#111]'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
            {hasSelection && (
              <div className="px-4 pt-3 pb-1 border-t border-gray-100 mt-2">
                <button 
                  onClick={() => {
                     const selectedOpt = options.find(o => o.checked);
                     if(selectedOpt) selectedOpt.onChange();
                     setIsOpen(false);
                  }} 
                  className="text-[12px] uppercase tracking-wider text-gray-500 hover:text-[#E8345E] font-semibold w-full text-left transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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

  // Narrow Hero Banner Data (Container-Width)
  const getBannerData = (s, isNew) => {
    if (isNew === 'true' || window.location.pathname === '/sale') {
      return { title: 'New Arrivals', image: '/images/banner-new-v2.png' };
    }
    if (!s || window.location.pathname === '/collections') {
      return { title: 'Collections', image: '/images/banner-collections.png' };
    }
    const normalized = s.toLowerCase();
    switch (normalized) {
      case 'necklace':
      case 'necklaces': return { title: 'Necklaces', image: '/images/necklace-banner-floral.png' };
      case 'earring':
      case 'earrings':  return { title: 'Earrings', image: '/images/banner-earrings-v2.png' };
      case 'ring':
      case 'rings':     return { title: 'Rings', image: '/images/rings-banner.png' };
      case 'bracelet':
      case 'bracelets': return { title: 'Bracelets', image: '/images/banner-bracelets.png' };
      default: return { title: categoryName || 'Jewelry', image: '/images/banner-collections.png' };
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

  // Prepare Filter Options for Dropdowns
  const categoryOptions = categories.map(c => ({
    label: c.name,
    checked: categoryId === c._id,
    onChange: () => updateParam('category', categoryId === c._id ? '' : c._id)
  }));

  const priceOptions = PRICE_RANGES.map(range => ({
    label: range.label,
    checked: minPrice === String(range.min) && maxPrice === String(range.max),
    onChange: () => {
      const isChecked = minPrice === String(range.min) && maxPrice === String(range.max);
      updateParam('minPrice', isChecked ? '' : String(range.min));
      updateParam('maxPrice', isChecked ? '' : String(range.max));
    }
  }));

  const materialOptions = MATERIAL_OPTIONS.map(mat => ({
    label: mat,
    checked: material === mat,
    onChange: () => updateParam('material', material === mat ? '' : mat)
  }));

  const genderOptions = GENDER_OPTIONS.map(gen => ({
    label: gen,
    checked: gender === gen,
    onChange: () => updateParam('gender', gender === gen ? '' : gen)
  }));

  const availabilityOptions = [{
    label: 'In Stock Only',
    checked: inStock === 'true',
    onChange: () => updateParam('inStock', inStock === 'true' ? '' : 'true')
  }];

  return (
    <div className="bg-white min-h-screen pb-20">
      <Helmet>
        <title>{currentCategoryName} â€” Tarini Jewellers</title>
        <meta name="description" content="Browse our complete luxury jewelry collection." />
      </Helmet>

      {/* FULL-WIDTH HERO BANNER */}
      {bannerData && (
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-[40vh] md:h-[50vh] lg:h-[55vh] min-h-[300px] overflow-hidden"
          >
            <img 
              src={bannerData.image} 
              alt={bannerData.title} 
              className="w-full h-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-4 mt-8">
              <h1 
                className="text-white text-[32px] md:text-[48px] lg:text-[60px] tracking-wide mb-1 drop-shadow-md leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {bannerData.title}
              </h1>
              <p className="text-[#C5A059] text-[11px] md:text-[13px] uppercase tracking-[0.3em] font-bold drop-shadow-lg mt-3" style={{ fontFamily: "var(--font-sans)" }}>
                Tarini Fine Jewellery
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* HORIZONTAL FILTER BAR */}
      <div className="border-b border-t border-gray-100 bg-white sticky top-[80px] lg:top-[96px] z-30">
        <div className="container-luxury py-2 flex items-center justify-between gap-4">
          
          {/* Desktop Filters */}
          <div className="hidden lg:flex flex-wrap items-center gap-1">
             <HorizontalDropdown title="Category" value={categoryId} options={categoryOptions} />
             <HorizontalDropdown title="Price" value={minPrice} options={priceOptions} />
             <HorizontalDropdown title="Material" value={material} options={materialOptions} />
             <HorizontalDropdown title="Gender" value={gender} options={genderOptions} />
             <HorizontalDropdown title="Availability" value={inStock} options={availabilityOptions} />
          </div>

          {/* Mobile Filter Trigger */}
          <button onClick={() => setMobileFilterOpen(true)} className="flex lg:hidden items-center gap-2 text-[#111] py-2 px-3 text-[13px] font-[500] border border-gray-200 rounded-[4px] bg-white">
            <Filter size={14} /> Filter
          </button>

          {/* Sort By Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
             <span className="text-[13px] text-gray-500 font-medium" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Sort by:</span>
             <select
                value={sortBy}
                onChange={(e) => updateParam('sortBy', e.target.value)}
                className="bg-transparent text-[14px] font-[500] cursor-pointer focus:ring-0 text-[#111] outline-none"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
             >
                {SORT_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {/* TITLE & PRODUCT GRID SECTION */}
      <div className="container-luxury py-8 lg:py-10">
        {/* Title row */}
        <div className="mb-6">
           <h2 className="text-[20px] md:text-[24px] text-[#111] font-[400]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
             {currentCategoryName} <span className="text-gray-400 text-[16px] md:text-[18px]">({pagination.totalItems || products.length} Designs)</span>
           </h2>
        </div>

        {/* Grid Area */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-[2px] aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-serif text-3xl text-gray-400 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No jewelry found</p>
            <button onClick={clearAllFilters} className="bg-[#111] text-white text-[11px] tracking-[0.15em] uppercase px-8 py-3 hover:bg-[#C5A059] transition-colors rounded-[2px]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-20">
            <button disabled={!pagination.hasPrevPage} onClick={() => goToPage(page - 1)} className="px-5 py-2.5 border border-gray-200 rounded-[2px] text-[11px] uppercase tracking-[0.1em] text-[#111] hover:border-[#111] disabled:opacity-40 transition-all duration-300 font-[600]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Prev
            </button>
            {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button key={pageNum} onClick={() => goToPage(pageNum)} className={`w-10 h-10 rounded-[2px] text-[12px] font-medium transition-all duration-300 ${page === pageNum ? 'bg-[#111] text-white border border-[#111]' : 'border border-gray-200 hover:border-[#111] text-[#111]'}`} style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {pageNum}
                </button>
              );
            })}
            <button disabled={!pagination.hasNextPage} onClick={() => goToPage(page + 1)} className="px-5 py-2.5 border border-gray-200 rounded-[2px] text-[11px] uppercase tracking-[0.1em] text-[#111] hover:border-[#111] disabled:opacity-40 transition-all duration-300 font-[600]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Next
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter slide-in */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden" 
            onClick={() => setMobileFilterOpen(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
              className="absolute left-0 bottom-0 w-full max-h-[85vh] bg-white rounded-t-xl overflow-hidden flex flex-col" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                <h2 className="text-[18px] text-[#111] font-semibold" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>Filter & Sort</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-gray-500 hover:text-black transition-colors"><X size={20} strokeWidth={2} /></button>
              </div>
              
              <div className="overflow-y-auto p-5 space-y-6 pb-24">
                {/* Mobile Sort */}
                <div>
                  <h3 className="text-[13px] font-[600] uppercase tracking-wider text-[#111] mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParam('sortBy', e.target.value)}
                    className="w-full border border-gray-200 rounded-[4px] bg-transparent text-[14px] font-[500] py-3 px-3 outline-none focus:border-black"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Filters */}
                <div>
                  <h3 className="text-[13px] font-[600] uppercase tracking-wider text-[#111] mb-3">Category</h3>
                  <div className="flex flex-col gap-2">
                     {categoryOptions.map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 py-2 cursor-pointer">
                           <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="w-4 h-4 accent-[#E8345E]" />
                           <span className="text-[14px] text-gray-700">{opt.label}</span>
                        </label>
                     ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-[600] uppercase tracking-wider text-[#111] mb-3">Price</h3>
                  <div className="flex flex-col gap-2">
                     {priceOptions.map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 py-2 cursor-pointer">
                           <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="w-4 h-4 accent-[#E8345E]" />
                           <span className="text-[14px] text-gray-700">{opt.label}</span>
                        </label>
                     ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex gap-3">
                 <button onClick={clearAllFilters} className="flex-1 py-3 text-[13px] font-semibold text-gray-700 bg-gray-100 rounded-[4px]">Clear All</button>
                 <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-3 text-[13px] font-semibold text-white bg-[#E8345E] rounded-[4px]">Apply</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
