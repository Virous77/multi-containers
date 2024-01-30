FROM node:18-alpine as client

WORKDIR /app

COPY package.json  /app

RUN npm install

COPY . /app

RUN npm run build

FROM nginx

EXPOSE 8000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=client /app/dist /usr/share/nginx/html