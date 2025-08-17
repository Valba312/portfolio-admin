import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { Badge, Card, CardBody, CardHeader, Input } from "@/components/ui";
import { Calendar, Code2, MapPin, Rocket } from "lucide-react";

// Библиотеки для генерации PDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Функция экспорта в PDF
async function exportPortfolioToPdf(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("portfolio.pdf");
}

export function Portfolio() {
  const { content, setContent } = useAppStore();
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/content`);
        if (res.ok) {
          const data = await res.json();
          if (data) setContent(data);
        }
      } catch {
        // тихо игнорируем, сайт покажет дефолтный контент
      }
    })();
  }, []);

  return (
    <div id="portfolio-content">
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/50 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide">
              {content.profile.name}
            </span>
          </div>
          <nav className="hidden gap-6 md:flex text-sm">
            <a href="#projects" className="text-neutral-300 hover:text-white">
              Проекты
            </a>
            <a href="#experience" className="text-neutral-300 hover:text-white">
              Опыт
            </a>
            <a href="#skills" className="text-neutral-300 hover:text-white">
              Навыки
            </a>
            <a href="#contact" className="text-neutral-300 hover:text-white">
              Контакты
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="btn-outline"
              onClick={() => exportPortfolioToPdf("portfolio-content")}
            >
              Скачать PDF
            </button>
            <a
              className="btn"
              href={content.profile.links.resume}
              target="_blank"
              rel="noreferrer"
            >
              CV
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="container pb-16 pt-10">
        <section className="grid items-center gap-8 py-8 md:grid-cols-[1.1fr_.9fr] md:py-14">
          <div>
            <Badge className="mb-4">Открыт к предложениям</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {content.profile.name}
            </h1>
            <p className="mt-2 text-lg text-neutral-300">
              {content.profile.title}
            </p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-neutral-300">
              {content.profile.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a className="btn" href="#projects">
                <Code2 className="h-4 w-4" /> Смотреть проекты
              </a>
              <a className="btn-outline" href="#contact">
                Связаться
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {content.profile.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Доступен с июля 2025
              </span>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="text-lg font-semibold">
                  {content.profile.name}
                </div>
                <div className="text-sm text-neutral-300">
                  {content.profile.title}
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-neutral-800 p-4">
                    <div className="text-2xl font-bold">5+</div>
                    <div className="text-neutral-400">лет опыта</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-800 p-4">
                    <div className="text-2xl font-bold">20+</div>
                    <div className="text-neutral-400">проектов</div>
                  </div>
                  <div className="rounded-2xl bg-neutral-800 p-4">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-neutral-400">кейса</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        <div className="separator" />

        <section id="projects" className="section">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">
            Избранные проекты
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.projects.map((p, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-300">
                        {p.description}
                      </p>
                    </div>
                    <div className="rounded-xl bg-neutral-800 p-3">
                      <Code2 className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t, i) => (
                      <span key={i} className="badge">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <a
                      className="link inline-flex items-center gap-2"
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Смотреть демо
                    </a>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <div className="separator" />

        <section id="experience" className="section">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Опыт</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {content.experience.map((j, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-semibold">{j.role}</div>
                      <div className="text-sm text-neutral-300">{j.company}</div>
                    </div>
                    <div className="text-sm text-neutral-300">{j.period}</div>
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">{j.location}</div>
                </CardHeader>
                <CardBody>
                  <ul className="space-y-2 text-sm">
                    {j.points.map((pt, i) => (
                      <li key={i} className="relative pl-5">
                        <span className="absolute left-0 top-2 block h-1.5 w-1.5 rounded-full bg-white" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <div className="separator" />

        <section id="skills" className="section">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Навыки</h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((s, i) => (
              <span key={i} className="badge">
                {s}
              </span>
            ))}
          </div>
        </section>

        <div className="separator" />

        <section id="contact" className="section">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">
            Связаться со мной
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="text-base font-semibold">Написать сообщение</div>
                <p className="text-sm text-neutral-300">
                  Форма-демо — подключите обработчик/почту или используйте
                  ссылки справа.
                </p>
              </CardHeader>
              <CardBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Спасибо! Сообщение отправлено (демо).");
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="mb-1 block text-sm">Ваше имя</label>
                    <Input placeholder="Иван Иванов" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Email</label>
                    <Input type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Сообщение</label>
                    <textarea
                      className="textarea"
                      rows={5}
                      placeholder="Коротко опишите задачу"
                      required
                    ></textarea>
                  </div>
                  <button className="btn" type="submit">
                    Отправить
                  </button>
                </form>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-base font-semibold">Другие способы</div>
                <p className="text-sm text-neutral-300">
                  Быстрые ссылки на соцсети и контакты.
                </p>
              </CardHeader>
              <CardBody className="grid gap-3">
                <a
                  className="btn-outline justify-start"
                  href={content.profile.links.email}
                >
                  Email: {content.profile.links.email.replace("mailto:", "")}
                </a>
                <a
                  className="btn-outline justify-start"
                  href={content.profile.links.phone}
                >
                  Позвонить
                </a>
                <a
                  className="btn-outline justify-start"
                  href={content.profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="btn-outline justify-start"
                  href={content.profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-900/60">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="text-sm text-neutral-300">
            © {new Date().getFullYear()} {content.profile.name}. Все права защищены.
          </div>
          <div className="text-sm text-neutral-300">
            Сделано с ❤️ на React + Tailwind
          </div>
        </div>
      </footer>
    </div>
  );
}
