import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesBar from '../components/home/FeaturesBar';
import CategoryCards from '../components/home/CategoryCards';
import DiamondRingsSection from '../components/home/DiamondRingsSection';
import LayeredCarousel from '../components/home/LayeredCarousel';
import MidBanner from '../components/home/MidBanner';
import EditorialBanner from '../components/home/EditorialBanner';
import WhyChooseUsBoxes from '../components/home/WhyChooseUsBoxes';
import InstagramGallery from '../components/home/InstagramGallery';
import Newsletter from '../components/home/Newsletter';
import RecentlyViewed from '../components/home/RecentlyViewed';
import LifestyleVideoSection from '../components/home/LifestyleVideoSection';
import ReelsSection from '../components/home/ReelsSection';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>TARINI JEWELLERS | Fine Jewellery Crafted with Precision</title>
      </Helmet>

      <div className="overflow-x-hidden bg-[#1A1512]">
        <HeroBanner />
        <FeaturesBar />
        
        <CategoryCards />

        <DiamondRingsSection />

        <LayeredCarousel />

        <LifestyleVideoSection />

        <MidBanner />
        
        <EditorialBanner />
        
        <WhyChooseUsBoxes />
        
        <ReelsSection />
        
        <InstagramGallery />
        
        <Newsletter />
        
        <RecentlyViewed />
      </div>
    </>
  );
}
