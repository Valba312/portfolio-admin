// src/utils/exportPdf.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportPortfolioToPdf(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // сохраняем исходные стили, чтобы потом восстановить
  const originalStyle = element.style.cssText;

  // временно убираем размытие и полупрозрачность, задаём тёмный фон
  element.classList.add("pdf-export-mode");
  element.style.backgroundColor = "#0d0d0d"; // фон, совпадающий с вашим сайтом

  // записываем предыдущие backdrop-filter (если был) и прозрачность в атрибут data
  element
    .querySelectorAll<HTMLElement>(".backdrop-blur")
    .forEach((el) => {
      el.dataset.prevFilter = el.style.backdropFilter;
      el.dataset.prevBg = el.style.backgroundColor;
      el.style.backdropFilter = "none";
      el.style.backgroundColor = getComputedStyle(el).backgroundColor.replace(/0\.\d+/, "1"); // убираем прозрачность
    });

  // создаём снимок; useCORS нужен, чтобы корректно брать иконки/шрифты
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0d0d0d",
  });

  // восстанавливаем прежние стили
  element.style.cssText = originalStyle;
  element
    .querySelectorAll<HTMLElement>(".backdrop-blur")
    .forEach((el) => {
      el.style.backdropFilter = el.dataset.prevFilter || "";
      el.style.backgroundColor = el.dataset.prevBg || "";
    });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("portfolio.pdf");
}
