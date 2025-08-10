
# Portfolio + Admin Panel (Vite + React + TS + Tailwind)

- **Админ панель** на `/admin`: редактирование профиля, проектов, опыта, навыков и ссылок.
- **Сохранение**: автоматически в localStorage. Есть **Export/Import JSON** и **Reset**.
- **Роутинг**: [wouter](https://github.com/molefrog/wouter).
- **Деплой на Vercel**: работает как SPA. `vercel.json` уже добавлен.

## Запуск локально
```bash
npm i
npm run dev
```

## Деплой на Vercel
Через GitHub или CLI:
```bash
npm i -g vercel
vercel
vercel --prod
```

## Импорт/экспорт контента
- В админке нажмите **Export JSON**, чтобы скачать файл контента.
- **Import JSON** — загрузить файл и применить.
- **Reset** — сброс к дефолту из `defaultContent.ts`.
