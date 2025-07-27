# mini-webs-2023-2024 🕸️🧪

[![GitHub last commit](https://img.shields.io/github/last-commit/Shiro-nn/mini-webs-2023-2024)](https://github.com/Shiro-nn/mini-webs-2023-2024/commits)
[![License: MIT](https://img.shields.io/github/license/Shiro-nn/mini-webs-2023-2024)](LICENSE)
[![Status: Archived](https://img.shields.io/badge/status-archived-lightgrey.svg)](https://github.com/Shiro-nn/mini-webs-2023-2024)

![Repo Stats](https://github-readme-stats.vercel.app/api/pin/?username=Shiro-nn\&repo=mini-webs-2023-2024)

> **mini-webs-2023-2024** — архив тестовых веб-проектов на JS/TS (2023-2024 гг.). Включает CLI-утилиты, REST-API и бэкенд-сервисы. Репозиторий **архивирован** — код доступен "как есть" для изучения и экспериментов.

---

## 📂 Проекты в репозитории

### 🚗 `car-cli` - CLI для управления данными об автомобилях
**Стек:** Node.js, TypeScript, Express, MongoDB  
**Особенности:**
- Аутентификация через RSA-шифрование
- CRUD-операции с автомобилями (бренд, модель, год, цена)
- Готовые команды для GET/POST/PUT/PATCH/DELETE
```bash
node dist/init.js --method=get --login=test --password=pass
```

### 🌐 `fydne.api` - Гео-IP и Discord API
**Стек:** Node.js, Express, MongoDB  
**Эндпоинты:**
- `GET /geoip?ip=...` - геолокация по IP
- `GET /discord?id=...` - информация о пользователе Discord
- Кэширование результатов в MongoDB
```bash
npm install
node init.js
```

### 🧪 `idk-test` - Эксперименты с NestJS
**Стек:** NestJS, TypeScript, PostgreSQL, Knex  
**Структура:**
- Контроллеры аутентификации
- Модели пользователей/комментариев
- Конфигурация для HTTP/HTTPS
```bash
npm run start:dev
```

---

## 🛠️ Системные требования
- **Node.js 18+** (для всех проектов)
- **MongoDB 6+** (для `car-cli` и `fydne.api`)
- **PostgreSQL 14+** (для `idk-test`)
- **TypeScript 5.1+** (для сборки проектов)

---

## 📦 Запуск проектов
1. Клонируйте репозиторий:
```bash
git clone https://github.com/Shiro-nn/mini-webs-2023-2024.git
```
2. Установите зависимости для каждого проекта:
```bash
cd car-cli/client && npm install
cd fydne.api && npm install
cd idk-test && npm install
```
3. Запустите нужный сервис (пример для `car-cli`):
```bash
npm run build && npm run start -- --method=get --login=admin --password=12345
```

---

## 📜 Лицензия
Код распространяется под лицензией **MIT**. Использование — на ваш риск, без гарантий поддержки.

> Проекты заморожены, для экспериментов и доработок — форкайте репозиторий.
