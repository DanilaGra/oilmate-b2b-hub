import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { sendTelegramNotification } from "@/lib/telegram";
import { MapPin, Truck, Package, Building2, User, ChevronLeft } from "lucide-react";

type CustomerType = "individual" | "business";
type DeliveryType = "pickup" | "city" | "shipping";

interface DeliveryOption {
  id: DeliveryType;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const individualDeliveryOptions: DeliveryOption[] = [
  {
    id: "pickup",
    icon: <MapPin className="h-5 w-5" />,
    title: "Пункт выдачи",
    subtitle: "Некрасовская 69 стр 1 · завтра",
  },
  {
    id: "city",
    icon: <Truck className="h-5 w-5" />,
    title: "Доставка по городу",
    subtitle: "Курьером до двери",
  },
  {
    id: "shipping",
    icon: <Package className="h-5 w-5" />,
    title: "Транспортная компания",
    subtitle: "Отправка по России",
  },
];

const businessDeliveryOptions: DeliveryOption[] = [
  {
    id: "pickup",
    icon: <MapPin className="h-5 w-5" />,
    title: "Самовывоз с ПВЗ",
    subtitle: "Некрасовская 69 стр 1",
  },
  {
    id: "city",
    icon: <Truck className="h-5 w-5" />,
    title: "Доставка по городу",
    subtitle: "Курьером на адрес компании",
  },
  {
    id: "shipping",
    icon: <Package className="h-5 w-5" />,
    title: "Доставка по России",
    subtitle: "Транспортной компанией",
  },
];

interface CheckoutFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutForm = ({ onBack, onComplete }: CheckoutFormProps) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [customerType, setCustomerType] = useState<CustomerType>("individual");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Individual fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Business fields
  const [inn, setInn] = useState("");
  const [email, setEmail] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizCity, setBizCity] = useState("");

  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryOptions = customerType === "individual" ? individualDeliveryOptions : businessDeliveryOptions;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (customerType === "individual") {
      if (!fullName.trim() || fullName.trim().length < 2) newErrors.fullName = "Введите ФИО";
      if (!phone.trim() || phone.trim().length < 10) newErrors.phone = "Введите номер телефона";
      if (deliveryType === "city" && !address.trim()) newErrors.address = "Введите адрес доставки";
      if (deliveryType === "shipping" && !city.trim()) newErrors.city = "Введите город";
    } else {
      if (!inn.trim() || (inn.trim().length !== 10 && inn.trim().length !== 12)) newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Введите корректный email";
      if (!bizPhone.trim() || bizPhone.trim().length < 10) newErrors.bizPhone = "Введите номер телефона";
      if (deliveryType === "city" && !bizAddress.trim()) newErrors.bizAddress = "Введите адрес доставки";
      if (deliveryType === "shipping" && !bizCity.trim()) newErrors.bizCity = "Введите город";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const deliveryLabel =
      deliveryType === "pickup"
        ? "Самовывоз (Некрасовская 69 стр 1)"
        : deliveryType === "city"
        ? "Доставка по городу"
        : "Доставка по России (ТК)";

    const orderData = {
      name: customerType === "individual" ? fullName : `Юр. лицо (ИНН: ${inn})`,
      phone: customerType === "individual" ? phone : bizPhone,
      email: customerType === "business" ? email : "",
      inn: customerType === "business" ? inn : undefined,
      city: customerType === "individual" ? (deliveryType === "shipping" ? city : undefined) : (deliveryType === "shipping" ? bizCity : undefined),
      address: customerType === "individual" ? (deliveryType === "city" ? address : undefined) : (deliveryType === "city" ? bizAddress : undefined),
      deliveryType: deliveryType === "pickup" ? ("pickup" as const) : ("delivery" as const),
      comment: [
        `Тип клиента: ${customerType === "individual" ? "Физ. лицо" : "Юр. лицо"}`,
        `Способ доставки: ${deliveryLabel}`,
        comment ? `Комментарий: ${comment}` : "",
      ].filter(Boolean).join("\n"),
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
      onComplete();
      toast({
        title: "Заказ оформлен!",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      setTimeout(() => clearCart(), 2000);
    } else {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить заказ. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    errorKey: string,
    placeholder: string,
    type = "text",
    maxLength?: number
  ) => (
    <div>
      <label className="text-sm font-medium mb-1.5 block text-foreground">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (errors[errorKey]) setErrors((p) => ({ ...p, [errorKey]: "" }));
        }}
        className={errors[errorKey] ? "border-destructive" : ""}
        maxLength={maxLength}
      />
      {errors[errorKey] && <p className="text-xs text-destructive mt-1">{errors[errorKey]}</p>}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header with back button */}
      <div className="flex items-center gap-3 px-6 pt-2 pb-3">
        <button onClick={onBack} className="p-1 -ml-1 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">Оформление заказа</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Customer type toggle — WB style */}
        <div className="flex bg-muted rounded-xl p-1 mb-5">
          <button
            onClick={() => { setCustomerType("individual"); setDeliveryType("pickup"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              customerType === "individual"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            Физ. лицо
          </button>
          <button
            onClick={() => { setCustomerType("business"); setDeliveryType("pickup"); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              customerType === "business"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Юр. лицо
          </button>
        </div>

        {/* Delivery options */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Способ получения</h3>
          <div className="space-y-2">
            {deliveryOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDeliveryType(opt.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  deliveryType === opt.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  deliveryType === opt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {opt.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{opt.title}</div>
                  <div className="text-xs text-muted-foreground">{opt.subtitle}</div>
                </div>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  deliveryType === opt.id ? "border-primary" : "border-muted-foreground/30"
                }`}>
                  {deliveryType === opt.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact fields */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            {customerType === "individual" ? "Данные получателя" : "Данные компании"}
          </h3>

          {customerType === "individual" ? (
            <>
              {renderField("ФИО", fullName, setFullName, "fullName", "Иванов Иван Иванович")}
              {renderField("Телефон", phone, setPhone, "phone", "+7 (999) 123-45-67", "tel")}
              {deliveryType === "city" && renderField("Адрес доставки", address, setAddress, "address", "ул. Примерная, д. 1, кв. 10")}
              {deliveryType === "shipping" && renderField("Город", city, setCity, "city", "Москва")}
            </>
          ) : (
            <>
              {renderField("ИНН", inn, setInn, "inn", "1234567890", "text", 12)}
              {renderField("Email", email, setEmail, "email", "company@example.com", "email")}
              {renderField("Телефон", bizPhone, setBizPhone, "bizPhone", "+7 (999) 123-45-67", "tel")}
              {deliveryType === "city" && renderField("Адрес доставки", bizAddress, setBizAddress, "bizAddress", "ул. Примерная, д. 1")}
              {deliveryType === "shipping" && renderField("Город", bizCity, setBizCity, "bizCity", "Москва")}
            </>
          )}

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-1.5 block text-foreground">Комментарий</label>
            <Textarea
              placeholder="Дополнительная информация..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-muted rounded-xl p-4 mt-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "товар" : items.length < 5 ? "товара" : "товаров"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Итого</span>
            <span className="text-xl font-bold text-foreground">
              {getTotalPrice().toLocaleString()} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="p-6 border-t border-border">
        <Button
          className="w-full h-12 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold rounded-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправляем..." : "Запросить счёт на оплату"}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
