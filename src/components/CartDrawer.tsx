import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";
import { categoryNames } from "@/data/products";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const [isOrderMode, setIsOrderMode] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleClose = () => {
    setIsCartOpen(false);
    setIsOrderMode(false);
    setOrderComplete(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {orderComplete ? (
          <>
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-xl">Заказ оформлен</SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Спасибо за заказ!</h3>
              <p className="text-muted-foreground">
                Мы свяжемся с вами в ближайшее время для подтверждения
              </p>
            </div>
          </>
        ) : items.length === 0 ? (
          <>
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-xl">Корзина</SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Корзина пуста</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Добавьте товары для оформления заказа
              </p>
              <Button onClick={() => setIsCartOpen(false)}>
                Перейти к каталогу
              </Button>
            </div>
          </>
        ) : isOrderMode ? (
          <CheckoutForm
            onBack={() => setIsOrderMode(false)}
            onComplete={() => {
              setOrderComplete(true);
              setTimeout(() => {
                setOrderComplete(false);
                setIsOrderMode(false);
                setIsCartOpen(false);
              }, 2000);
            }}
          />
        ) : (
          <>
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-xl">Корзина</SheetTitle>
            </SheetHeader>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-muted rounded-xl"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain bg-background rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {categoryNames[item.product.category]} • {item.product.volume}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-primary/10 transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">
                        {(item.product.price * item.quantity).toLocaleString()} ₽
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {item.product.price.toLocaleString()} × {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="p-6 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Итого:</span>
                <span className="text-2xl font-bold text-foreground">
                  {getTotalPrice().toLocaleString()} ₽
                </span>
              </div>
              <Button
                className="w-full h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-full"
                onClick={() => setIsOrderMode(true)}
              >
                Оформить заказ
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
