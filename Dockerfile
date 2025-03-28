###### Build #####
FROM node:12-slim AS node
LABEL author="Harry Ho"
RUN mkdir /app
WORKDIR /app
COPY . .

RUN cd  /app
RUN npm install
RUN npm run build


###### Run #####
FROM nginx:alpine
LABEL author="Harry Ho"
WORKDIR /var/cache/nginx
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf


#########################################################
## docker build . -t  nc-demo:3.0
## docker run --publish 8080:80  --name nd3 nc-demo:3.0


