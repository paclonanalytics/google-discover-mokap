## Discover Dashboard – локальный запуск

- **Стек**: Vite + React + TypeScript (client), Express (server).
- **Пакетный менеджер**: pnpm 10 (см. `package.json` → `packageManager`).

### Предварительные условия
- Node.js ≥ 20 (LTS).
- pnpm: `corepack enable` и `corepack prepare pnpm@10.4.1 --activate`.

### Быстрый старт
1. `cd /Users/paclonskyartem/Desktop/python_scripts/discover-analytics/discover-dashboard`
2. Установите зависимости: `pnpm install`
3. Создайте файл окружения:
   - `cp env.example .env`
   - При необходимости отредактируйте значения (`VITE_*` переменные читаются Vite из корня проекта).
4. Запустите клиент: `pnpm dev`
   - Vite стартует на `http://localhost:3000` (если порт занят, будет выбран следующий свободный, см. `vite.config.ts`).
   - Карта в `MapView` работает только при заданном `VITE_FRONTEND_FORGE_API_KEY`; без него компонент покажет подсказку и не упадет.

### Продакшн-сборка и сервер
- Соберите фронтенд и сервер: `pnpm build`
- Запустите Express, который отдаёт содержимое `dist/public`: `pnpm start`

### Описание переменных окружения
| Переменная | Назначение | Значение по умолчанию в `env.example` |
| --- | --- | --- |
| `VITE_APP_TITLE` | Заголовок вкладки/приложения | `Discover Dashboard` |
| `VITE_APP_WORDMARK` | Текстовое слово‑логотип в UI | `Discover` |
| `VITE_APP_LOGO` | Путь к favicon/logo | `/logo.png` |
| `VITE_ANALYTICS_ENDPOINT` / `VITE_ANALYTICS_WEBSITE_ID` | Подключение к системе аналитики (скрипт в `client/index.html`) | Заглушки |
| `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` | URL и идентификатор OAuth-портала. Если не заданы, `getLoginUrl()` вернет локальный `/login` и выведет предупреждение | Заглушки |
| `VITE_FRONTEND_FORGE_API_KEY` | Ключ для проксированного Google Maps API. Обязателен для отображения карты | `your-google-maps-api-key` |
| `VITE_FRONTEND_FORGE_API_URL` | Базовый URL прокси (по умолчанию `https://forge.butterfly-effect.dev`) | Значение по умолчанию |

### Проверка перед использованием
- `pnpm check` — типизация TypeScript.
- `pnpm build` — убедиться, что клиент собирается без ошибок.
- (Опционально) `pnpm preview` — локальный предпросмотр собранного фронтенда.

### Полезные замечания
- Корень Vite — папка `client`. Бандл складывается в `dist/public`. Express (`server/index.ts`) обслуживает эту папку при `pnpm start`.
- Патч `patches/wouter@3.7.1.patch` применяется автоматически pnpm’ом (см. `package.json → pnpm.patchedDependencies`), поэтому используйте pnpm, а не npm/yarn.

