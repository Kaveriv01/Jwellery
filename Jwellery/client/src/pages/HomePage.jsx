import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ShopByCategory from '../components/home/ShopByCategory';
import { NewArrivals } from '../components/home/FeaturedCollection';
import EditorialBanner from '../components/home/EditorialBanner';
import StorySection from '../components/home/StorySection';
import BottomBanners from '../components/home/BottomBanners';
import { productService } from '../services/productService';

export default function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured({ limit: 8 }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const { newArrivals = [] } = featuredData || {};

  return (
    <>
      <Helmet>
        <title>TARINI JEWELLERS | Fine Jewellery Crafted with Precision</title>
        <meta name="description" content="Discover Tarini Jewellers — fine jewellery crafted with precision, passion, and the finest materials." />
        <meta property="og:title" content="Tarini Jewellers | Fine Jewellery" />
        <meta property="og:description" content="Discover Tarini Jewellers — fine jewellery crafted with precision, passion, and the finest materials." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="overflow-x-hidden bg-white">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Feature Bar */}
        <WhyChooseUs />

        {/* 3. Shop by Category */}
        <ShopByCategory />

        {/* 4. The Tarini Experience */}
        <EditorialBanner />

        {/* 5. New Arrivals */}
        {newArrivals.length > 0 && <NewArrivals products={newArrivals} />}

        {/* 6. Discover Tarini */}
        <StorySection />

        {/* 7. Bottom Banners (Sale & Club) */}
        <BottomBanners />
      </div>
    </>
  );
}
