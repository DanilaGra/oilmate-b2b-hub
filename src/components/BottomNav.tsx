import { Home, Search, LayoutGrid, ShoppingCart, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { searchProducts, categoryNames } from "@/data/products";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = getTotalItems();

  const isActive = (path: string) => location.pathname === path;
  const searchResults = searchProducts(searchQuery);
  const hasQuery = searchQuery.trim().length > 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery("");
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (productId: number) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  const items = [
    {
      label: "Главная",
      icon: Home,
      action: () => navigate("/"),
      active: isActive("/"),
    },
    {
      label: "Поиск",
      icon: Search,
      action: () => setSearchOpen(!searchOpen),
      active: searchOpen,
    },
    {
      label: "Каталог",
      icon: LayoutGrid,
      action: () => navigate("/catalog"),
      active: location.pathname.startsWith("/catalog"),
    },
    {
      label: "Корзина",
      icon: ShoppingCart,
      action: () => setIsCartOpen(true),
      active: false,
      badge: cartCount,
    },
  ];

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-[4.5rem] left-0 right-0 p-3 flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search results */}
            {hasQuery && (
              <div className="bg-card rounded-2xl shadow-lg max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-2">
                      {searchResults.slice(0, 6).map((product) => (
                        <button
                          key={product.id}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-contain bg-muted rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {categoryNames[product.category]} • {product.volume}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-primary text-sm">{product.price.toLocaleString()} ₽</p>
                            {product.oldPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                {product.oldPrice.toLocaleString()} ₽
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {searchResults.length > 6 && (
                      <div className="border-t border-border p-2">
                        <button
                          className="w-full text-center text-sm text-accent font-medium py-2 hover:bg-muted rounded-xl transition-colors"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                            navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
                          }}
                        >
                          Показать все ({searchResults.length})
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    По запросу «{searchQuery}» ничего не найдено
                  </div>
                )}
              </div>
            )}

            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 pr-10 rounded-2xl bg-card border border-border text-foreground text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {hasQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border safe-bottom">
        <div className="flex items-center justify-around h-16">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors",
                  item.active ? "text-accent" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
