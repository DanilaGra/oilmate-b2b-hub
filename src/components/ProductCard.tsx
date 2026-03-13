import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Check } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id?: string | number;
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  oilType: string;
  isUniversal?: boolean;
  category?: string;
  viscosity?: string;
  approvals?: string;
  specification?: string;
  viscosityClass?: string;
  application?: string;
  standard?: string;
  color?: string;
  type?: string;
}

const ProductCard = ({
  id = 1,
  name,
  brand,
  volume,
  price,
  oldPrice,
  image,
  inStock,
  oilType,
  isUniversal = true,
  category,
  viscosity,
}: ProductCardProps) => {
  const rubles = Math.floor(price);
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;
  const discountPercent = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

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
          {oldPrice && discountPercent && (
            <div className="absolute left-2 bottom-2 flex flex-col items-start gap-1.5">
              <div className="bg-gradient-to-r from-[hsl(0,85%,45%)] to-[hsl(0,75%,55%)] text-white rounded-full px-2.5 py-1 flex items-center justify-center">
                <span className="text-[9px] font-bold leading-none">-{discountPercent}%</span>
              </div>
              <div className="bg-gradient-to-r from-[hsl(211,100%,30%)] to-[hsl(211,100%,50%)] text-accent-foreground rounded-full px-3.5 py-1.5 flex items-center justify-center">
                <span className="text-[9px] font-bold uppercase tracking-wide leading-none">Распродажа</span>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1 px-0.5">
          <span className={`text-lg font-bold ${oldPrice ? 'bg-gradient-to-r from-[hsl(211,60%,95%)] to-[hsl(211,60%,90%)] text-foreground rounded-full px-3 py-0.5' : 'text-foreground'}`}>
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
        <AddToCartButton product={{ id: Number(id), name, brand, volume, price, oldPrice, image, inStock, oilType, isUniversal, category: category || '' }} />
      </div>
    </div>
  );
};

const AddToCartButton = ({ product }: { product: any }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartOpen(true);
  };

  return (
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
  );
};

export default ProductCard;
