import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Check, ShoppingCart, Star } from "lucide-react";
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
}: ProductCardProps) => {
  const rubles = Math.floor(price);
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;
  const discountPercent = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-border">
      <Link to={`/product/${id}`} className="flex flex-col flex-1">
        {/* Top section: brand + direct supply badge */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-xs font-semibold text-foreground uppercase leading-tight line-clamp-2">
              {name}
            </h3>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">{brand.charAt(0)}</span>
            </div>
          </div>
          <p className="text-[10px] text-accent font-semibold uppercase tracking-wide">
            Поставляется напрямую от производителя
          </p>
        </div>

        {/* Image */}
        <div className="relative px-2 py-3 flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
            />
            
            {/* Volume badge */}
            <div className="absolute left-2 top-2 flex items-center gap-1 bg-accent/10 text-accent rounded-md px-1.5 py-0.5">
              <span className="text-xs font-bold">{volume}</span>
            </div>

            {/* Discount badge */}
            {discountPercent && discountPercent > 0 && (
              <div className="absolute left-2 bottom-2 bg-accent text-accent-foreground rounded-md px-2 py-0.5">
                <span className="text-xs font-bold">-{discountPercent}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="px-3 pb-1">
          <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1.5">
            {oilType} · {volume}
          </p>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs font-medium text-foreground">4.8</span>
            <span className="text-[10px] text-muted-foreground">· {brand}</span>
          </div>
        </div>

        {/* Price */}
        <div className="px-3 pb-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${oldPrice ? 'text-accent' : 'text-foreground'}`}>
              {rubles.toLocaleString("ru-RU")} ₽
            </span>
            {oldRubles && (
              <span className="text-xs text-muted-foreground line-through">
                {oldRubles.toLocaleString("ru-RU")} ₽
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart button */}
      <div className="px-3 pb-3">
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
      className={`w-full rounded-xl font-medium h-10 transition-all ${
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
        <>
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          В корзину
        </>
      )}
    </Button>
  );
};

export default ProductCard;
