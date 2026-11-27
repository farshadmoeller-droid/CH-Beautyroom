import Hero from '@/components/hero/Hero';
import Statement from '@/components/sections/Statement';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import InstagramTeaser from '@/components/sections/InstagramTeaser';
import BookingSection from '@/components/booking/BookingSection';
import Faq from '@/components/sections/Faq';
import { faqSchema } from '@/lib/jsonld';

export const dynamic = 'force-static';

export default function Startseite() {
  return (
    <>
      <Hero />
      <Statement />
      <Services />
      <Process />
      <Gallery />
      <About />
      <InstagramTeaser />
      <BookingSection />
      <Faq />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
