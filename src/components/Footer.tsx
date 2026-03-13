import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = [
  {
    title: "Покупателям",
    links: [
      "Каталог товаров",
      "Обратная связь",
      "Доставка и оплата",
      "Возврат товара",
      "Акции и скидки",
    ],
  },
  {
    title: "Сотрудничество",
    links: [
      "Вакансии",
      "Франчайзинг",
      "Поставщикам",
      "Аренда площадей",
    ],
  },
  {
    title: "Правовая информация",
    links: [
      "Юридическая информация",
      "Пользовательское соглашение",
      "Оферта о продаже товаров",
      "Политика обработки данных",
    ],
  },
  {
    title: "Компания",
    links: [
      "О нас",
      "Контакты",
      "Вакансии",
    ],
  },
];

const Footer = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenSection(openSection === i ? null : i);
  };

  return (
    <footer className="bg-background border-t border-border">
      {/* Desktop */}
      <div className="container py-8 hidden md:block">
        <div className="grid grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">© OilMate 2024–2026. Все права защищены.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* VK */}
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 13.54c.492.478.963.978 1.383 1.525.185.243.36.494.485.78.178.405-.02.85-.472.877l-2.1.003c-.54.046-.995-.173-1.39-.542-.316-.295-.61-.612-.915-.918-.124-.125-.257-.24-.404-.338-.294-.195-.55-.15-.727.16-.18.315-.22.665-.236 1.017-.023.52-.182.655-.705.68-1.116.053-2.17-.132-3.15-.712-1.02-.6-1.812-1.44-2.498-2.39C5.953 12.02 4.97 10.176 4.1 8.268c-.195-.428-.06-.66.41-.668.676-.012 1.352-.014 2.028.002.327.008.544.196.672.5.53 1.258 1.192 2.446 2.005 3.547.215.29.434.58.735.784.328.222.568.155.712-.21.092-.234.132-.482.15-.732.058-.82.065-1.64-.03-2.458-.06-.507-.306-.838-.81-.935-.258-.05-.22-.147-.095-.238.215-.158.417-.256.818-.256h2.374c.374.073.458.242.508.62l.003 2.645c-.006.147.073.58.337.677.212.07.352-.1.48-.233.576-.612 .988-1.337 1.354-2.088.16-.33.298-.672.427-1.013.096-.253.245-.377.525-.373l2.285.003c.068 0 .137 0 .203.015.388.07.495.246.382.626-.178.6-.535 1.102-.905 1.594-.396.527-.818 1.036-1.21 1.568-.36.486-.33.73.094 1.167z"/>
              </svg>
            </a>
            {/* OK */}
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 6.6a2.85 2.85 0 110 5.7 2.85 2.85 0 010-5.7zm3.495 7.545c-.465.27-.975.465-1.515.585l1.74 1.74a.975.975 0 01-1.38 1.38L12 15.51l-2.34 2.34a.975.975 0 01-1.38-1.38l1.74-1.74a6.075 6.075 0 01-1.515-.585.975.975 0 01.975-1.69 4.125 4.125 0 004.035 0 .975.975 0 01.975 1.69z"/>
              </svg>
            </a>
            {/* Telegram */}
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.203-.657-.643.136-.953l11.57-4.46c.536-.194 1.006.13.83.94z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        {sections.map((section, i) => (
          <div key={section.title} className="border-b border-border">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-foreground"
            >
              {section.title}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === i ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === i && (
              <ul className="px-4 pb-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="px-4 py-5">
          <p className="text-xs text-muted-foreground mb-4">© OilMate 2024–2026. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 13.54c.492.478.963.978 1.383 1.525.185.243.36.494.485.78.178.405-.02.85-.472.877l-2.1.003c-.54.046-.995-.173-1.39-.542-.316-.295-.61-.612-.915-.918-.124-.125-.257-.24-.404-.338-.294-.195-.55-.15-.727.16-.18.315-.22.665-.236 1.017-.023.52-.182.655-.705.68-1.116.053-2.17-.132-3.15-.712-1.02-.6-1.812-1.44-2.498-2.39C5.953 12.02 4.97 10.176 4.1 8.268c-.195-.428-.06-.66.41-.668.676-.012 1.352-.014 2.028.002.327.008.544.196.672.5.53 1.258 1.192 2.446 2.005 3.547.215.29.434.58.735.784.328.222.568.155.712-.21.092-.234.132-.482.15-.732.058-.82.065-1.64-.03-2.458-.06-.507-.306-.838-.81-.935-.258-.05-.22-.147-.095-.238.215-.158.417-.256.818-.256h2.374c.374.073.458.242.508.62l.003 2.645c-.006.147.073.58.337.677.212.07.352-.1.48-.233.576-.612 .988-1.337 1.354-2.088.16-.33.298-.672.427-1.013.096-.253.245-.377.525-.373l2.285.003c.068 0 .137 0 .203.015.388.07.495.246.382.626-.178.6-.535 1.102-.905 1.594-.396.527-.818 1.036-1.21 1.568-.36.486-.33.73.094 1.167z"/>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 6.6a2.85 2.85 0 110 5.7 2.85 2.85 0 010-5.7zm3.495 7.545c-.465.27-.975.465-1.515.585l1.74 1.74a.975.975 0 01-1.38 1.38L12 15.51l-2.34 2.34a.975.975 0 01-1.38-1.38l1.74-1.74a6.075 6.075 0 01-1.515-.585.975.975 0 01.975-1.69 4.125 4.125 0 004.035 0 .975.975 0 01.975 1.69z"/>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.203-.657-.643.136-.953l11.57-4.46c.536-.194 1.006.13.83.94z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
