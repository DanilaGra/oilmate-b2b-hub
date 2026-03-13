import { Search, ShoppingCart, Menu, X, ChevronRight, Droplet, Cog, Gauge, Factory, Snowflake, Wrench, MapPin, ChevronDown, Check, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts, categoryNames } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const cities = [
  { id: "vladivostok", name: "Владивосток", description: "Пункт выдачи заказов и доставка по всему Приморскому краю" },
  { id: "other", name: "Другой город", description: "Доставка заказов через транспортную компанию" },
];

const catalogCategories = [
  { id: "motor", name: "Моторные масла", icon: Droplet },
  { id: "transmission", name: "Трансмиссионные масла", icon: Cog },
  { id: "hydraulic", name: "Гидравлические масла", icon: Gauge },
  { id: "industrial", name: "Индустриальные масла", icon: Factory },
  { id: "lubricants", name: "Смазки", icon: Wrench },
  { id: "antifreeze", name: "Антифризы", icon: Snowflake },
  { id: "marine", name: "Судовые масла", icon: Droplet },
];

const Header = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState("vladivostok");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const cartCount = getTotalItems();
  const searchResults = searchProducts(searchQuery);
  const showResults = isSearchFocused && searchQuery.trim().length > 0;

  // Track scroll for sticky mobile search
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleProductClick = (productId: number) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsCatalogOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/catalog/${categoryId}`);
  };

  return (
    <>
      <header className="w-full bg-card">
        {/* Top navigation - hidden on mobile */}
        <div className="hidden md:block">
          <div className="container">
            <nav className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-6">
                {["Новости", "Акции", "Оптовикам", "Доставка", "О компании", "Контакты"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
              <button
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsCityOpen(true)}
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {cities.find(c => c.id === selectedCity)?.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile city selector */}
        <div className="md:hidden container pt-2 pb-0">
          <button
            className="flex items-center gap-1 text-sm"
            onClick={() => setIsCityOpen(true)}
          >
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-muted-foreground">
              {cities.find(c => c.id === selectedCity)?.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Main header */}
        <div className="container py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-12 w-12 shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>

            {/* Catalog button with dropdown - desktop only */}
            <div className="relative hidden md:block" ref={catalogRef}>
              <Button 
                className="flex gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 h-12 rounded-full shrink-0 transition-all"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              >
                {isCatalogOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                Каталог
              </Button>

              {/* Catalog Dropdown */}
              {isCatalogOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-2xl overflow-hidden z-50 shadow-lg">
                  <div className="p-2">
                    {catalogCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          className="w-full flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-colors text-left group"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <p className="font-medium text-foreground flex-1">{category.name}</p>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => {
                        setIsCatalogOpen(false);
                        navigate("/catalog");
                      }}
                    >
                      Смотреть все товары
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Search - takes all available space */}
            <div className="flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Input
                    placeholder="Поиск..."
                    className="h-10 md:h-12 pl-4 pr-10 md:pr-12 rounded-full border-2 border-border focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0 bg-background w-full text-sm md:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-9 md:right-11 top-0.5 md:top-1 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0.5 md:right-1 top-0.5 md:top-1 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted"
                  >
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl overflow-hidden z-50 shadow-lg max-h-[70vh] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                            onClick={() => handleProductClick(product.id)}
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 md:w-12 md:h-12 object-contain bg-muted rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.name}</p>
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
                      <div className="border-t border-border p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
                          }}
                        >
                          Показать все результаты
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      По запросу «{searchQuery}» ничего не найдено
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-12 w-12 shrink-0"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Sticky mobile search on scroll */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-lg px-3 py-2 rounded-b-3xl transition-all duration-300",
        isScrolled ? "translate-y-0 opacity-100 shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            placeholder="Поиск..."
            className="h-10 pl-4 pr-10 rounded-full border-2 border-border focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0 bg-background w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-9 top-0.5 h-9 w-9 rounded-full hover:bg-muted"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0.5 top-0.5 h-9 w-9 rounded-full hover:bg-muted"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </form>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card overflow-y-auto">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-lg">Меню</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Categories */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Каталог</p>
              <div className="space-y-1">
                {catalogCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left text-primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/catalog");
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Menu className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Все товары</span>
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Информация</p>
              <div className="space-y-1">
                {["Новости", "Акции", "Оптовикам", "Доставка", "О компании", "Контакты"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block p-3 text-foreground hover:bg-muted rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* City Selection Modal */}
      {isCityOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCityOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl bg-card rounded-t-2xl md:rounded-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:fade-in duration-300">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold">Выберите город</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsCityOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-3 space-y-2">
              {/* Владивосток */}
              <button
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left",
                  selectedCity === "vladivostok"
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                )}
                onClick={() => { setSelectedCity("vladivostok"); setIsCityOpen(false); }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  selectedCity === "vladivostok" ? "bg-primary/20" : "bg-muted"
                )}>
                  <MapPin className={cn("h-5 w-5", selectedCity === "vladivostok" ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", selectedCity === "vladivostok" ? "text-primary" : "text-foreground")}>Владивосток</span>
                    {selectedCity === "vladivostok" && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      Пункт выдачи
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      Доставка по городу и Приморскому краю
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      Доставка до ТК
                    </span>
                  </div>
                </div>
              </button>

              {/* Другой город */}
              <button
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left",
                  selectedCity === "other"
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                )}
                onClick={() => { setSelectedCity("other"); setIsCityOpen(false); }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  selectedCity === "other" ? "bg-primary/20" : "bg-muted"
                )}>
                  <MapPin className={cn("h-5 w-5", selectedCity === "other" ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", selectedCity === "other" ? "text-primary" : "text-foreground")}>Другой город</span>
                    {selectedCity === "other" && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                    <Truck className="h-3 w-3" />
                    Доставка через транспортную компанию
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;