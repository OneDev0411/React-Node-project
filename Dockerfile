FROM node:18

ENV APP_HOME /app
WORKDIR $APP_HOME

COPY package.json .
RUN npm install -f

ADD . $APP_HOME
RUN npm run build

CMD [ "npm", "start" ]