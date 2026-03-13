import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import SaleSection from "@/components/SaleSection";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OilMate",
    "url": "https://oilmate-b2b-hub.lovable.app",
    "logo": "https://oilmate-b2b-hub.lovable.app/logo.png",
    "description": "Оптовый интернет-магазин моторных масел, автохимии и смазочных материалов",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-XXX-XXX-XX-XX",
      "contactType": "sales",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "sameAs": []
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="OilMate — Масла и автохимия оптом | B2B интернет-магазин"
        description="OilMate — оптовый интернет-магазин моторных масел, автохимии и смазочных материалов. Shell, Mobil, Castrol, Лукойл и другие бренды по выгодным ценам."
        keywords="моторное масло опт, автохимия оптом, масло Shell, Mobil, Castrol, трансмиссионное масло, антифриз, смазки"
        canonicalUrl="https://oilmate-b2b-hub.lovable.app/"
        structuredData={structuredData}
      />
      <Header />
      <main>
        <HeroBanner />
        <Categories />
        <SaleSection />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
