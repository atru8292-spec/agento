import "./globals.css";

export const metadata = {
  title: "Agento — ИИ-агенты для бизнеса",
  description: "ИИ-агент продаёт пока вы спите. Автоматизация продаж через ИИ-агентов.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
