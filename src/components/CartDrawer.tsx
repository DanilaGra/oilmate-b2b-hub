import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { useState } from "react";
import { categoryNames } from "@/data/products";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [isOrderMode, setIsOrderMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    phone: "",
    email: "",
    inn: "",
    city: "",
    address: "",
    deliveryType: undefined,
    comment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const setDeliveryType = (type: "pickup" | "delivery") => {
    setFormData((prev) => ({ 
      ...prev, 
      deliveryType: prev.deliveryType === type ? undefined : type 
    }));
  };

  const validateForm = (): boolean => {
    try {
      orderSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof OrderFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const orderData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      inn: formData.inn || undefined,
      city: formData.city || undefined,
      address: formData.address || undefined,
      deliveryType: formData.deliveryType,
      comment: formData.comment || undefined,
      items: items.map((item) => ({
        name: item.product.name,
        volume: item.product.volume,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: getTotalPrice(),
    };

    const success = await sendTelegramNotification(orderData);
    
    setIsSubmitting(false);
    
    if (success) {
      setOrderComplete(true);
      
      toast({
        title: "Заказ оформлен!",
        description: "Мы свяжемся с вами в ближайшее время для подтверждения",
      });
      
      // Reset after showing success
      setTimeout(() => {
        clearCart();
        setOrderComplete(false);
        setIsOrderMode(false);
        setIsCartOpen(false);
        setFormData({ name: "", phone: "", email: "", inn: "", city: "", address: "", deliveryType: undefined, comment: "" });
      }, 2000);
    } else {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить заказ. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsOrderMode(false);
    setOrderComplete(false);
    setErrors({});
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-xl">
            {orderComplete ? "Заказ оформлен" : isOrderMode ? "Оформление заказа" : "Корзина"}
          </SheetTitle>
        </SheetHeader>

        {orderComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Спасибо за заказ!</h3>
            <p className="text-muted-foreground">
              Мы свяжемся с вами в ближайшее время для подтверждения
            </p>
          </div>
        ) : items.length === 0 ? (
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
        ) : isOrderMode ? (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Order Summary */}
              <div className="bg-muted rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Товаров: {items.length}</span>
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => setIsOrderMode(false)}
                  >
                    Изменить
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Итого:</span>
                  <span className="text-xl font-bold text-primary">
                    {getTotalPrice().toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-4">
                {/* Required fields */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Имя <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Телефон <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Optional fields */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">ИНН</label>
                  <Input
                    placeholder="1234567890"
                    value={formData.inn}
                    onChange={(e) => handleInputChange("inn", e.target.value)}
                    maxLength={12}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Город</label>
                  <Input
                    placeholder="Москва"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Адрес доставки</label>
                  <Input
                    placeholder="ул. Примерная, д. 1"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                {/* Delivery type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Способ получения</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.deliveryType === "pickup"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
                      Самовывоз
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("delivery")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.deliveryType === "delivery"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                      }`}
                    >
                      <Truck className="h-4 w-4" />
                      Доставка
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Комментарий к заказу</label>
                  <Textarea
                    placeholder="Дополнительная информация к заказу..."
                    value={formData.comment}
                    onChange={(e) => handleInputChange("comment", e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 border-t border-border">
              <Button
                className="w-full h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-full"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправляем..." : "Запросить счёт на оплату"}
              </Button>
            </div>
          </>
        ) : (
          <>
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
                      <p className="font-bold text-primary">
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
                <span className="text-2xl font-bold text-primary">
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
