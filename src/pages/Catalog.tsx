import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X, ChevronLeft, ShoppingCart, ChevronDown } from "lucide-react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { allProducts, categoryNames, type ProductData } from "@/data/products";
import { categories } from "@/data/categories";
import SEO from "@/components/SEO";

// Get available filter options from actual products
const getAvailableFilters = (products: ProductData[], category: string | null) => {
  const categoryProducts = category && category !== "all" 
    ? products.filter(p => p.category === category)
    : products;

  const brands = [...new Set(categoryProducts.map(p => p.brand))].sort();
  const volumes = [...new Set(categoryProducts.map(p => p.volume))].sort();
  
  // Category-specific filters based on actual product data
  const specificFilters: { label: string; key: keyof ProductData; options: string[] }[] = [];

  if (category === "motor") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const approvals = [...new Set(categoryProducts.map(p => p.approvals).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (approvals.length > 0) specificFilters.push({ label: "Допуски", key: "approvals", options: approvals as string[] });
  }

  if (category === "transmission") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const specs = [...new Set(categoryProducts.map(p => p.specification).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (specs.length > 0) specificFilters.push({ label: "Спецификация", key: "specification", options: specs as string[] });
  }

  if (category === "hydraulic") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosityClasses = [...new Set(categoryProducts.map(p => p.viscosityClass).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosityClasses.length > 0) specificFilters.push({ label: "Класс вязкости", key: "viscosityClass", options: viscosityClasses as string[] });
  }

  if (category === "industrial") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  if (category === "lubricants") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип смазки", key: "oilType", options: oilTypes as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  if (category === "antifreeze") {
    const types = [...new Set(categoryProducts.map(p => p.type).filter(Boolean))];
    const standards = [...new Set(categoryProducts.map(p => p.standard).filter(Boolean))];
    const colors = [...new Set(categoryProducts.map(p => p.color).filter(Boolean))];
    
    if (types.length > 0) specificFilters.push({ label: "Тип", key: "type", options: types as string[] });
    if (standards.length > 0) specificFilters.push({ label: "Стандарт", key: "standard", options: standards as string[] });
    if (colors.length > 0) specificFilters.push({ label: "Цвет", key: "color", options: colors as string[] });
  }

  if (category === "marine") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  return { brands, volumes, specificFilters };
};

const CheckboxFilter = ({ 
  items, 
  selected, 
  onToggle,
  visibleCount = 5 
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  visibleCount?: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleCount;

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {visibleItems.map((item) => (
        <label
          key={item}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <Checkbox
            checked={selected.includes(item)}
            onCheckedChange={() => onToggle(item)}
            className="h-[18px] w-[18px] rounded border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
            {item}
          </span>
        </label>
      ))}
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-muted-foreground text-sm mt-2 hover:text-primary transition-colors"
        >
          Показать ещё {hiddenCount} из {items.length}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="flex items-center gap-1 text-muted-foreground text-sm mt-1 hover:text-primary transition-colors"
        >
          Свернуть
          <ChevronDown className="h-3.5 w-3.5 rotate-180" />
        </button>
      )}
    </div>
  );
};

const Catalog = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { getTotalItems, setIsCartOpen } = useCart();
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string[]>>({});
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFloatingWidgets, setShowFloatingWidgets] = useState(false);

  const cartCount = getTotalItems();

  // Show floating widgets after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingWidgets(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setCategoryFilters({});
    setSelectedVolumes([]);
    setPriceFrom("");
    setPriceTo("");
  }, [category]);

  // Lock body scroll when mobile filters are open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFilters]);

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  // Determine active category
  const activeCategory = category && category !== "all" && category !== "promo" && category !== "new" 
    ? category 
    : null;

  // Get available filters based on current category
  const availableFilters = useMemo(() => 
    getAvailableFilters(allProducts, activeCategory), 
    [activeCategory]
  );

  const categoryTitle = searchQuery 
    ? `Результаты поиска: «${searchQuery}»`
    : category 
      ? categoryNames[category] || "Каталог" 
      : "Все товары";

  const seoTitle = searchQuery
    ? `${searchQuery} — поиск | OilMate`
    : category && categoryNames[category]
      ? `${categoryNames[category]} — купить оптом | OilMate`
      : "Каталог масел и автохимии | OilMate";

  const seoDescription = searchQuery
    ? `Результаты поиска «${searchQuery}» в каталоге OilMate. Моторные масла, автохимия и смазочные материалы оптом.`
    : category && categoryNames[category]
      ? `${categoryNames[category]} — купить оптом в OilMate. Широкий ассортимент, выгодные цены, быстрая доставка.`
      : "Каталог моторных масел, трансмиссионных масел, антифризов и смазок. Оптовые цены от OilMate.";

  const toggleFilter = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const toggleCategoryFilter = (filterKey: string, value: string) => {
    setCategoryFilters(prev => {
      const current = prev[filterKey] || [];
      if (current.includes(value)) {
        return { ...prev, [filterKey]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [filterKey]: [...current, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Filter by search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.brand.toLowerCase().includes(lowerQuery) ||
          product.oilType.toLowerCase().includes(lowerQuery) ||
          (product.viscosity && product.viscosity.toLowerCase().includes(lowerQuery)) ||
          (product.approvals && product.approvals.toLowerCase().includes(lowerQuery));
        
        if (!matchesSearch) return false;
      }
      
      // Filter by URL category
      if (activeCategory && product.category !== activeCategory) {
        return false;
      }
      
      // Filter by brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      
      // Filter by volume
      if (selectedVolumes.length > 0 && !selectedVolumes.includes(product.volume)) {
        return false;
      }

      // Filter by price
      if (priceFrom && product.price < parseInt(priceFrom)) {
        return false;
      }
      if (priceTo && product.price > parseInt(priceTo)) {
        return false;
      }

      // Filter by category-specific filters
      for (const filter of availableFilters.specificFilters) {
        const selectedValues = categoryFilters[filter.key] || [];
        if (selectedValues.length > 0) {
          const productValue = product[filter.key];
          if (!productValue || !selectedValues.includes(productValue as string)) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [searchQuery, activeCategory, selectedBrands, selectedVolumes, priceFrom, priceTo, categoryFilters, availableFilters]);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": categoryTitle,
    "description": seoDescription,
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "brand": {
          "@type": "Brand",
          "name": product.brand
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "RUB",
          "availability": product.inStock 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        }
      }
    }))
  }), [categoryTitle, seoDescription, filteredProducts]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setCategoryFilters({});
    setSelectedVolumes([]);
    setPriceFrom("");
    setPriceTo("");
  };

  const hasActiveFilters = selectedBrands.length > 0 || 
    Object.keys(categoryFilters).some(k => categoryFilters[k].length > 0) || 
    selectedVolumes.length > 0 || 
    priceFrom || 
    priceTo;

  const FiltersContent = () => (
    <>
      {/* Price filter */}
      <div className="mb-8">
        <span className="text-sm font-semibold text-foreground mb-3 block">Цена, ₽</span>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            placeholder="от 0"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="rounded-lg border-border text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
          <Input
            type="number"
            placeholder="до 30 000"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="rounded-lg border-border text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          />
        </div>
        <Slider
          min={0}
          max={30000}
          step={100}
          minStepsBetweenThumbs={1}
          value={[
            priceFrom ? parseInt(priceFrom) : 0,
            priceTo ? parseInt(priceTo) : 30000,
          ]}
          onValueChange={([from, to]) => {
            setPriceFrom(from > 0 ? String(from) : "");
            setPriceTo(to < 30000 ? String(to) : "");
          }}
          className="cursor-grab active:cursor-grabbing [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:rounded-full [&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:shadow-md [&_span.absolute]:bg-accent"
        />
      </div>

      {/* Brand filter */}
      {availableFilters.brands.length > 0 && (
        <div className="mb-8">
          <span className="text-sm font-semibold text-foreground mb-3 block">Бренд</span>
          <CheckboxFilter
            items={availableFilters.brands}
            selected={selectedBrands}
            onToggle={(item) => toggleFilter(item, selectedBrands, setSelectedBrands)}
            visibleCount={5}
          />
        </div>
      )}
      
      {/* Volume filter */}
      {availableFilters.volumes.length > 0 && activeCategory !== 'lubricants' && (
        <div className="mb-8">
          <span className="text-sm font-semibold text-foreground mb-3 block">Объём, л</span>
          <CheckboxFilter
            items={availableFilters.volumes}
            selected={selectedVolumes}
            onToggle={(item) => toggleFilter(item, selectedVolumes, setSelectedVolumes)}
            visibleCount={5}
          />
        </div>
      )}

      {/* Category-specific filters */}
      {availableFilters.specificFilters.map(filter => (
        <div key={filter.key} className="mb-8">
          <span className="text-sm font-semibold text-foreground mb-3 block">{filter.label}</span>
          <CheckboxFilter
            items={filter.options}
            selected={categoryFilters[filter.key] || []}
            onToggle={(item) => toggleCategoryFilter(filter.key, item)}
            visibleCount={5}
          />
        </div>
      ))}

      {/* Apply button */}
      <Button 
        className="w-full rounded-xl gradient-primary text-primary-foreground"
        onClick={() => setShowFilters(false)}
      >
        Применить
      </Button>

      <Button
        variant="ghost"
        className="w-full text-muted-foreground mt-2"
        onClick={resetFilters}
      >
        Сбросить фильтры
      </Button>
    </>
  );

  // Category navigation for "all" view
  const categoryLinks = [
    { id: "motor", name: "Моторные масла" },
    { id: "transmission", name: "Трансмиссионные масла" },
    { id: "hydraulic", name: "Гидравлические масла" },
    { id: "industrial", name: "Индустриальные масла" },
    { id: "lubricants", name: "Смазки" },
    { id: "antifreeze", name: "Антифризы" },
    { id: "marine", name: "Судовые масла" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="моторное масло, трансмиссионное масло, антифриз, смазки, автохимия, опт"
        canonicalUrl={`https://oilmate-b2b-hub.lovable.app/catalog/${category || 'all'}`}
        structuredData={structuredData}
      />
      <Header />
      <main className="py-4 md:py-6" itemScope itemType="https://schema.org/ItemList">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="mb-4 md:mb-5">
            <ol className="flex items-center flex-wrap gap-2">
              <li>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95"
                >
                  Главная
                </Link>
              </li>
              <li className="text-muted-foreground/40">/</li>
              {activeCategory ? (
                <>
                  <li>
                    <Link 
                      to="/catalog" 
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95"
                    >
                      Каталог
                    </Link>
                  </li>
                  <li className="text-muted-foreground/40">/</li>
                  <li>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-foreground/10 text-foreground font-medium">
                      {categoryNames[activeCategory]}
                    </span>
                  </li>
                </>
              ) : (
                <li>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-foreground/10 text-foreground font-medium">
                    {categoryTitle}
                  </span>
                </li>
              )}
            </ol>
          </nav>

          {/* Back button for category pages */}
          {activeCategory && (
            <button
              onClick={() => navigate("/catalog")}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground mb-4 transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Все категории
            </button>
          )}

          {/* Title and filter toggle */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">{categoryTitle}</h1>
              {(activeCategory || searchQuery) && (
                <span className="text-base md:text-lg text-muted-foreground">{filteredProducts.length} товаров</span>
              )}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1 px-2 md:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs md:text-sm hover:bg-primary/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Сбросить поиск
                </button>
              )}
            </div>
            {activeCategory && (
              <Button
                variant="outline"
                className="md:hidden gap-2 shrink-0"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            )}
          </div>

          {/* Category selection view (when no specific category selected) */}
          {!activeCategory && !searchQuery && (
            <div className="grid gap-3 md:gap-4 grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-8">
              {categories.map((cat) => {
                const productCount = allProducts.filter(p => p.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/catalog/${cat.id}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden bg-muted rounded-2xl mb-2">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-xs md:text-sm text-center leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center">
                      {productCount} товаров
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex gap-8">
            {/* Filters sidebar - desktop, only show when category is selected */}
            {activeCategory && (
              <aside className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24">
                  {/* Category breadcrumb above filters */}
                  <div className="bg-card rounded-2xl p-4 mb-3">
                    <button
                      onClick={() => navigate("/catalog")}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Все категории
                    </button>
                    <div className="ml-5 inline-flex items-center px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground">
                      {categoryNames[activeCategory]}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-5">
                    <h3 className="font-medium text-foreground mb-5">Фильтры</h3>
                    <FiltersContent />
                  </div>
                </div>
              </aside>
            )}

            {/* Products grid */}
            <div className="flex-1">
              
              {filteredProducts.length > 0 ? (
                <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={index} {...product} />
                  ))}
                </div>
              ) : (activeCategory || searchQuery) ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Товары не найдены</p>
                  <Button
                    variant="link"
                    className="text-primary mt-2"
                    onClick={resetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[90%] max-w-sm bg-card overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
              <span className="font-semibold text-lg">Фильтры</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Filters */}
            <div className="p-4">
              <FiltersContent />
            </div>
          </div>
        </div>
      )}

      {/* Floating Widgets - Mobile Only */}
      {showFloatingWidgets && (
        <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 md:hidden">
          {/* Filter button - only show when category is active */}
          {activeCategory && (
            <button
              onClick={() => setShowFilters(true)}
              className="w-11 h-11 rounded-full bg-card shadow-lg flex items-center justify-center border border-border transition-transform hover:scale-105 active:scale-95"
            >
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full" />
              )}
            </button>
          )}
          
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-11 h-11 rounded-full gradient-primary shadow-lg flex items-center justify-center relative transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-card text-foreground text-xs font-bold rounded-full flex items-center justify-center border border-border">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
