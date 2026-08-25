import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import ProductCard from '../product/ProductCard';

export default function RecentlyViewed() {
  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured({ limit: 4 }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const products = data?.newArrivals || [];

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-[#C7A56A] text-[10px] tracking-widest uppercase mb-2">NEW IN</p>
          <h2 className="text-3xl text-[#5C1D24] font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Jewellery that becomes part of your story
          </h2>
          <div className="w-12 h-[1px] bg-[#C7A56A] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
