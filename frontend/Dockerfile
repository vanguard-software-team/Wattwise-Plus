FROM node

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN rm .env

RUN npm run build


EXPOSE $FRONTEND_PORT


CMD ["npm", "run", "dev"]