import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import ServicesOverview from '@/components/ServicesOverview';
import ServiceDetails from '@/components/ServiceDetails';
import FinelineSection from '@/components/FinelineSection';
import GallerySection from '@/components/GallerySection';
import About from '@/components/About';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Ringana from '@/components/Ringana';
import BookingSection from '@/components/booking/BookingSection';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import { faqSchema } from '@/lib/jsonld';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'CH Beautyroom – Wimpern, Lifting & Fineline-Tattoo in Ramsloh',
  description:
    'Wimpernverlängerung, Lashlifting, Browlifting und feine Fineline-Tattoos im Homestudio in 26683 Ramsloh. Termine nach Vereinbarung – für Saterland, Friesoythe, Barßel und Cloppenburg.',
  alternates: { canonical: '/' },
};

export default function Startseite() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <ServiceDetails />
      <FinelineSection />
      <GallerySection />
      <About />
      <Process />
      <Testimonials />
      <Ringana />
      <BookingSection />
      <Faq />
      <Contact />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
