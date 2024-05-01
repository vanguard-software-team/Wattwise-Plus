FROM node

WORKDIR /frontend

COPY package.json package-lock.json ./

COPY . .

RUN rm .env

RUN npm install

RUN npm run build


EXPOSE $FRONTEND_PORT


CMD ["npm", "run", "dev"]