import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import InstagramGrid from '../components/InstagramGrid';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
      <InstagramGrid />
      <Newsletter />
    </>
  );
}
