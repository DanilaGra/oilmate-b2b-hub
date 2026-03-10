import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Check } from "lucide-react";
import oilProductImage from "@/assets/oil-product.png";
import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import SEO from "@/components/SEO";

// Временные данные товаров (в реальном приложении будут из API)
const productsData: Record<string, {
  id: number;
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  oilType: string;
  isUniversal: boolean;
  category: string;
  inStock: boolean;
  description: string;
  specifications: { label: string; value: string }[];
}> = {
  "1": {
    id: 1,
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    image: oilProductImage,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
    inStock: true,
    description: "Shell Helix Ultra 5W-40 — полностью синтетическое моторное масло, разработанное для обеспечения максимальной защиты двигателя и его чистоты. Создано с применением технологии Shell PurePlus, которая превращает природный газ в кристально чистое базовое масло.",
    specifications: [
      { label: "Вязкость", value: "5W-40" },
      { label: "Тип", value: "Синтетическое" },
      { label: "Объем", value: "4 л" },
      { label: "Производитель", value: "Shell" },
      { label: "Страна", value: "Германия" },
      { label: "Допуски", value: "API SN/CF, ACEA A3/B3, A3/B4" },
      { label: "Применение", value: "Бензиновые и дизельные двигатели" },
    ],
  },
  "2": {
    id: 2,
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    image: oilProductImage,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
    inStock: true,
    description: "Mobil 1 ESP Formula 5W-30 — синтетическое моторное масло с улучшенными эксплуатационными характеристиками, специально разработанное для продления срока службы и поддержания эффективности систем снижения токсичности выхлопных газов.",
    specifications: [
      { label: "Вязкость", value: "5W-30" },
      { label: "Тип", value: "Синтетическое" },
      { label: "Объем", value: "4 л" },
      { label: "Производитель", value: "Mobil" },
      { label: "Страна", value: "США" },
      { label: "Допуски", value: "API SN, ACEA C2/C3" },
      { label: "Применение", value: "Бензиновые и дизельные двигатели с сажевыми фильтрами" },
    ],
  },
};

const Product = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  const product = id ? productsData[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <Link to="/" className="text-primary hover:underline">
              Вернуться на главную
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rubles = Math.floor(product.price);
  const kopecks = Math.round((product.price - rubles) * 100) || 99;
  const oldRubles = product.oldPrice ? Math.floor(product.oldPrice) : null;
  const oldKopecks = product.oldPrice ? Math.round((product.oldPrice - Math.floor(product.oldPrice)) * 100) || 99 : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        volume: product.volume,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        inStock: product.inStock,
        oilType: product.oilType,
        isUniversal: product.isUniversal,
        category: product.category,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "image": product.image,
    "sku": product.id.toString(),
    "offers": {
      "@type": "Offer",
      "url": `https://oilmate-b2b-hub.lovable.app/product/${id}`,
      "priceCurrency": "RUB",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "OilMate"
      }
    },
    "additionalProperty": product.specifications.map(spec => ({
      "@type": "PropertyValue",
      "name": spec.label,
      "value": spec.value
    }))
  }), [product, id]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} — купить оптом | OilMate`}
        description={`${product.name} ${product.volume} по цене ${product.price}₽. ${product.description.slice(0, 120)}...`}
        keywords={`${product.brand}, ${product.oilType}, ${product.volume}, моторное масло, купить`}
        canonicalUrl={`https://oilmate-b2b-hub.lovable.app/product/${id}`}
        ogType="product"
        structuredData={structuredData}
      />
      <Header />
      <main className="py-4 md:py-6" itemScope itemType="https://schema.org/Product">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="mb-4 md:mb-5">
            <ol className="flex items-center flex-wrap gap-2 text-sm">
              <li>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95"
                >
                  Главная
                </Link>
              </li>
              <li className="text-muted-foreground/40">/</li>
              <li>
                <Link 
                  to="/catalog" 
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95"
                >
                  Каталог
                </Link>
              </li>
              <li className="text-muted-foreground/40">/</li>
              <li>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-foreground/10 text-foreground font-medium line-clamp-1">
                  {product.name.length > 25 ? product.name.slice(0, 25) + '...' : product.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Back button */}
          <Link 
            to="/catalog" 
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm gradient-primary text-primary-foreground font-medium mb-4 md:mb-6 transition-all duration-200 hover:opacity-90 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Назад в каталог
          </Link>

          <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-6 md:p-8"
                />
              </div>
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                {product.name}
              </h1>

              {/* Stock info */}
              <div className="flex items-center gap-1.5 text-sm text-green-600 mb-4 md:mb-6">
                <Check className="h-4 w-4" />
                <span className="font-medium">В наличии — 12 шт.</span>
              </div>

              {/* Price */}
              <div className="mb-4 md:mb-6">
                {product.oldPrice && (
                  <span className="text-base md:text-lg text-muted-foreground line-through block mb-1">
                    {oldRubles}<sup className="text-xs">{String(oldKopecks).padStart(2, '0')}</sup>₽
                  </span>
                )}
                <div className={`inline-flex items-baseline ${product.oldPrice ? 'bg-gradient-to-r from-primary/20 to-accent/20 px-2 py-1 rounded-lg' : ''}`}>
                  <span className={`text-2xl md:text-3xl font-bold ${product.oldPrice ? 'text-primary' : 'text-foreground'}`}>
                    {rubles.toLocaleString("ru-RU")}
                  </span>
                  <sup className={`text-xs md:text-sm font-bold ml-0.5 ${product.oldPrice ? 'text-primary' : 'text-foreground'}`}>
                    {kopecks.toString().padStart(2, '0')}
                  </sup>
                  <span className={`text-xl md:text-2xl font-bold ml-1 ${product.oldPrice ? 'text-primary' : 'text-foreground'}`}>₽</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Цена указана с НДС 22%</p>
              </div>

              {/* Quantity and cart */}
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="flex items-center gap-1 md:gap-2 border border-border rounded-full px-1 md:px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 md:h-10 md:w-10 rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 md:w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 md:h-10 md:w-10 rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  className={`flex-1 h-11 md:h-12 rounded-full font-semibold transition-all ${
                    added 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "gradient-primary hover:opacity-90 text-primary-foreground"
                  }`}
                  onClick={added ? handleOpenCart : handleAddToCart}
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Добавлено
                    </>
                  ) : (
                    "В корзину"
                  )}
                </Button>
              </div>

              {/* Description */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Описание</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Характеристики</h2>
                <div className="space-y-1 md:space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm font-medium text-foreground text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;