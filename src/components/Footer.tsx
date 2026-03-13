import { useState } from "react";
import { ChevronDown, Phone, Send } from "lucide-react";

const sections = [
  {
    title: "О нас",
    links: [
      "Политика обработки данных",
      "Документы сайта",
      "Вакансии",
      "Наши магазины",
    ],
  },
  {
    title: "Покупателям",
    links: [
      "Вопросы — ответы",
      "Заказы и доставка",
      "Возврат товара",
      "Акции и скидки",
    ],
  },
  {
    title: "Контакты",
    links: [
      "Общие контакты",
      "Отдел продаж",
      "Для предложений по ассортименту",
      "Партнерская программа",
    ],
  },
];

const Footer = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenSection(openSection === i ? null : i);
  };

  return (
    <footer className="bg-secondary text-foreground">
      {/* Desktop */}
      <div className="container hidden md:block py-10">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-8">
          {/* Brand + contacts */}
          <div>
            <h2 className="text-xl font-bold mb-5 tracking-tight">OilMate</h2>
            <div className="mb-4">
              <a href="tel:88007707021" className="text-lg font-semibold hover:opacity-80 transition-opacity">
                8 800 770 70 21
              </a>
              <p className="text-xs opacity-60 mt-1">круглосуточный телефон</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest opacity-70">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright + Bottom bar */}
        <p className="mt-10 text-xs opacity-40">© OilMate 2024–2026. Все права защищены.</p>
        <div className="mt-3 pt-4 border-t border-background/10 flex items-center">
          <div className="flex items-center gap-5">
            {/* Telegram */}
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
              <Send className="h-5 w-5" />
            </a>
            {/* VK */}
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 13.54c.492.478.963.978 1.383 1.525.185.243.36.494.485.78.178.405-.02.85-.472.877l-2.1.003c-.54.046-.995-.173-1.39-.542-.316-.295-.61-.612-.915-.918-.124-.125-.257-.24-.404-.338-.294-.195-.55-.15-.727.16-.18.315-.22.665-.236 1.017-.023.52-.182.655-.705.68-1.116.053-2.17-.132-3.15-.712-1.02-.6-1.812-1.44-2.498-2.39C5.953 12.02 4.97 10.176 4.1 8.268c-.195-.428-.06-.66.41-.668.676-.012 1.352-.014 2.028.002.327.008.544.196.672.5.53 1.258 1.192 2.446 2.005 3.547.215.29.434.58.735.784.328.222.568.155.712-.21.092-.234.132-.482.15-.732.058-.82.065-1.64-.03-2.458-.06-.507-.306-.838-.81-.935-.258-.05-.22-.147-.095-.238.215-.158.417-.256.818-.256h2.374c.374.073.458.242.508.62l.003 2.645c-.006.147.073.58.337.677.212.07.352-.1.48-.233.576-.612.988-1.337 1.354-2.088.16-.33.298-.672.427-1.013.096-.253.245-.377.525-.373l2.285.003c.068 0 .137 0 .203.015.388.07.495.246.382.626-.178.6-.535 1.102-.905 1.594-.396.527-.818 1.036-1.21 1.568-.36.486-.33.73.094 1.167z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        <div className="px-4 pt-6 pb-4">
          <h2 className="text-lg font-bold tracking-tight">OilMate</h2>
          <div className="mt-3">
            <a href="tel:88007707021" className="text-base font-semibold">8 800 770 70 21</a>
            <p className="text-xs opacity-50 mt-0.5">круглосуточный телефон</p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm opacity-70 mt-3">
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>

        {sections.map((section, i) => (
          <div key={section.title} className="border-t border-background/10">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold"
            >
              {section.title}
              <ChevronDown
                className={`h-4 w-4 opacity-50 transition-transform ${openSection === i ? "rotate-180" : ""}`}
              />
            </button>
            {openSection === i && (
              <ul className="px-4 pb-3 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="px-4 py-5 border-t border-background/10">
          <p className="text-xs opacity-40 mb-4">© OilMate 2024–2026. Все права защищены.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
              <Send className="h-5 w-5" />
            </a>
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 13.54c.492.478.963.978 1.383 1.525.185.243.36.494.485.78.178.405-.02.85-.472.877l-2.1.003c-.54.046-.995-.173-1.39-.542-.316-.295-.61-.612-.915-.918-.124-.125-.257-.24-.404-.338-.294-.195-.55-.15-.727.16-.18.315-.22.665-.236 1.017-.023.52-.182.655-.705.68-1.116.053-2.17-.132-3.15-.712-1.02-.6-1.812-1.44-2.498-2.39C5.953 12.02 4.97 10.176 4.1 8.268c-.195-.428-.06-.66.41-.668.676-.012 1.352-.014 2.028.002.327.008.544.196.672.5.53 1.258 1.192 2.446 2.005 3.547.215.29.434.58.735.784.328.222.568.155.712-.21.092-.234.132-.482.15-.732.058-.82.065-1.64-.03-2.458-.06-.507-.306-.838-.81-.935-.258-.05-.22-.147-.095-.238.215-.158.417-.256.818-.256h2.374c.374.073.458.242.508.62l.003 2.645c-.006.147.073.58.337.677.212.07.352-.1.48-.233.576-.612.988-1.337 1.354-2.088.16-.33.298-.672.427-1.013.096-.253.245-.377.525-.373l2.285.003c.068 0 .137 0 .203.015.388.07.495.246.382.626-.178.6-.535 1.102-.905 1.594-.396.527-.818 1.036-1.21 1.568-.36.486-.33.73.094 1.167z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
