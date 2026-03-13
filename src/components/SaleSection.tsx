import ProductCard from "./ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import oilProductImage from "@/assets/oil-product.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

const saleProducts = [
  {
    id: "1",
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    viscosity: "5W-40",
  },
  {
    id: "5",
    name: "Total Quartz INEO ECS 5W-30",
    brand: "Total",
    volume: "5 л",
    price: 4299,
    oldPrice: 4799,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    viscosity: "5W-30",
  },
  {
    id: "12",
    name: "Sintec Antifreeze Ultra G11 зеленый",
    brand: "Sintec",
    volume: "5 л",
    price: 590,
    oldPrice: 750,
    image: oilProductImage,
    inStock: true,
    oilType: "Готовый",
    isUniversal: true,
  },
  {
    id: "4",
    name: "Лукойл Genesis Armortech 5W-40",
    brand: "Лукойл",
    volume: "4 л",
    price: 1890,
    oldPrice: 2390,
    image: oilProductImage,
    inStock: true,
    oilType: "Полусинтетика",
    isUniversal: true,
    viscosity: "5W-40",
  },
  {
    id: "3",
    name: "Castrol EDGE 5W-30 LL синтетическое",
    brand: "Castrol",
    volume: "4 л",
    price: 3850,
    oldPrice: 4500,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
    viscosity: "5W-30",
  },
];

const SaleSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  return (
    <section className="py-8 bg-card">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">
              Распродажа
            </h2>
            <span className="text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-[hsl(0,80%,55%)] to-[hsl(30,90%,55%)] text-white rounded-full px-3 py-1">
              Sale
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-muted hover:bg-muted-foreground/20 h-10 w-10 disabled:opacity-50"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-muted hover:bg-muted-foreground/20 h-10 w-10 disabled:opacity-50"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {saleProducts.map((product) => {
              const discountPercent = product.oldPrice 
                ? Math.round((1 - product.price / product.oldPrice) * 100) 
                : 0;
              return (
                <CarouselItem 
                  key={product.id} 
                  className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <SaleProductCard {...product} discountPercent={discountPercent} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

interface SaleProductCardProps {
  id: string;
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  oilType: string;
  isUniversal?: boolean;
  viscosity?: string;
  discountPercent: number;
}

import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Check } from "lucide-react";

const SaleProductCard = ({
  id,
  name,
  brand,
  volume,
  price,
  oldPrice,
  image,
  inStock,
  oilType,
  isUniversal = true,
  viscosity,
  discountPercent,
}: SaleProductCardProps) => {
  const rubles = Math.floor(price);
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: Number(id), name, brand, volume, price, oldPrice, image, inStock, oilType, isUniversal, category: '' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartOpen(true);
  };

  return (
    <div className="group relative flex flex-col h-full">
      <Link to={`/product/${id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative mb-2.5 overflow-hidden rounded-2xl bg-muted">
          <div className="aspect-[3/4] flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain p-6 transition-transform group-hover:scale-105"
            />
          </div>
          {/* Discount badge */}
          <div className="absolute left-2 top-2 bg-gradient-to-r from-[hsl(0,80%,50%)] to-[hsl(30,90%,50%)] text-white rounded-full px-3 py-1.5 flex items-center justify-center">
            <span className="text-xs font-bold leading-none">-{discountPercent}%</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1 px-0.5">
          <span className="text-lg font-bold bg-gradient-to-r from-[hsl(0,70%,93%)] to-[hsl(30,80%,90%)] text-foreground rounded-full px-3 py-0.5">
            {rubles.toLocaleString("ru-RU")} ₽
          </span>
          {oldRubles && (
            <span className="text-xs text-muted-foreground line-through">
              {oldRubles.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm text-foreground line-clamp-2 leading-snug mb-1.5 px-0.5">
          {name}
        </p>

        {/* Parameters */}
        <p className="text-xs text-muted-foreground px-0.5 mb-3">
          <span>{[viscosity, oilType].filter(Boolean).join(" · ")}</span>
          <span className="hidden md:inline"> · {volume}</span>
        </p>
      </Link>

      {/* Add to cart */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          className={`w-full rounded-xl font-medium h-11 transition-all ${
            added
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "gradient-primary text-primary-foreground hover:opacity-90"
          }`}
          onClick={added ? handleOpenCart : handleAddToCart}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Добавлено
            </>
          ) : (
            "В корзину"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SaleSection;
