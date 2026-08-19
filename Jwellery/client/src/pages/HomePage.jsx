import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesBar from '../components/home/FeaturesBar';
import ShopByCategory from '../components/home/ShopByCategory';
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

      <div className="overflow-x-hidden bg-[#FDFBF7]">
        <HeroBanner />
        <FeaturesBar />
        
        <ShopByCategory />

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
