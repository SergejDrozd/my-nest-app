# Этап 1: build
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Этап 2: production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Копируем только нужные файлы из build-этапа
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Открываем порт
EXPOSE 3000

# Запуск приложения
CMD ["node", "dist/main.js"]

# Базовый образ Node.js
#FROM node:20-alpine

# Рабочая директория внутри контейнера
#WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
#COPY package*.json ./

# Устанавливаем зависимости
#RUN npm install

# Копируем весь исходный код
#COPY . .

# Собираем проект
#RUN npm run build

# Открываем порт 3000
#EXPOSE 3000

# Команда запуска приложения
#CMD ["node", "dist/main.js"]
