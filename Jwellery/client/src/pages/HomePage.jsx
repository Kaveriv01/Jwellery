import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import WhyChooseUs from '../components/home/WhyChooseUs';
import ShopByCategory from '../components/home/ShopByCategory';
import { BestSellers, NewArrivals } from '../components/home/FeaturedCollection';
import EditorialBanner from '../components/home/EditorialBanner';
import OccasionSection from '../components/home/OccasionSection';
import StorySection from '../components/home/StorySection';
import InstagramGallery from '../components/home/InstagramGallery';
import Newsletter from '../components/home/Newsletter';
import { productService } from '../services/productService';

export default function HomePage() {
  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeatured({ limit: 8 }).then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  const { bestSellers = [], newArrivals = [] } = featuredData || {};

  return (
    <>
      <Helmet>
        <title>Tarini Jewellers | Timeless Jewellery for Every Story</title>
        <meta name="description" content="Discover Tarini Jewellers — handcrafted luxury jewellery inspired by Indian heritage. Shop rings, necklaces, earrings, bracelets." />
        <meta property="og:title" content="Tarini Jewellers | Timeless Jewellery for Every Story" />
        <meta property="og:description" content="Elegant. Timeless. Luxury. Discover Tarini Jewellers — where Indian heritage meets modern fashion." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="overflow-x-hidden bg-[#FAF8F3]">
        {/* 1. Hero Banner */}
        <HeroBanner />

        {/* 2. Trust / Value Bar */}
        <WhyChooseUs />

        {/* 3. Shop by Category */}
        <ShopByCategory />

        {/* 4. Best Sellers */}
        {bestSellers.length > 0 && <BestSellers products={bestSellers} />}

        {/* 5. Editorial Story Banner */}
        <EditorialBanner />

        {/* 6. New Arrivals */}
        {newArrivals.length > 0 && <NewArrivals products={newArrivals} />}

        {/* 7. Brand Story */}
        <StorySection />

        {/* 8. Why Tarini (Trust Section) */}
        <OccasionSection />

        {/* 9. Instagram Gallery */}
        <InstagramGallery />

        {/* 10. Newsletter */}
        <Newsletter />
      </div>
    </>
  );
}
