import { Home, Search, LayoutGrid, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery("");
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
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
            className="absolute bottom-[4.5rem] left-0 right-0 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit}>
              <input
                autoFocus
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 rounded-2xl bg-card border border-border text-foreground text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
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
