
export type Links = { github: string; linkedin: string; email: string; phone: string; resume: string; };
export type Profile = { name: string; title: string; location: string; summary: string; avatarUrl: string; links: Links; };
export type Project = { title: string; description: string; tags: string[]; href: string; };
export type Job = { role: string; company: string; period: string; location: string; points: string[]; };
export type Content = { profile: Profile; projects: Project[]; experience: Job[]; skills: string[]; };
export const DEFAULT_CONTENT: Content = {
  profile: { name: "Ваше Имя", title: "Frontend / Full-Stack Developer", location: "Амстердам, Нидерланды",
    summary: "Делаю быстрые и аккуратные интерфейсы. Люблю типобезопасный код, DX и продуманный UX.",
    avatarUrl: "", links: { github: "https://github.com/", linkedin: "https://www.linkedin.com/", email: "mailto:you@example.com", phone: "tel:+1234567890", resume: "#" } },
  projects: [
    { title: "Next.js SaaS Dashboard", description: "Адаптивная админ-панель с графиками, аутентификацией и тёмной темой.", tags: ["Next.js","TypeScript","PostgreSQL","tRPC"], href: "#" },
    { title: "AI Prompt Studio", description: "Тул для быстрой сборки промптов и A/B тестов, экспорт шаблонов.", tags: ["React","Zustand","Vite","OpenAI"], href: "#" },
    { title: "E-commerce UI Kit", description: "Набор компонентов магазина: каталог, корзина, checkout, платежи.", tags: ["Tailwind","Stripe","SSR"], href: "#" }
  ],
  experience: [
    { role: "Senior Frontend Engineer", company: "Tech Co.", period: "2023 — 2025", location: "Remote", points: ["Руководил внедрением дизайн-системы (Tailwind)", "Сократил TTI на 35% благодаря code-splitting", "Построил CI для визуальных регрессий"] },
    { role: "Full-Stack Developer", company: "Startup X", period: "2021 — 2023", location: "Hybrid", points: ["Разработал платежный модуль на Stripe", "Сократил churn на 12%", "Менторил и вёл код-ревью"] }
  ],
  skills: ["TypeScript","React / Next.js","Node.js","Tailwind CSS","tRPC / REST","PostgreSQL","Prisma","Playwright","Vitest","CI/CD"]
};
