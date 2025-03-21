###### Build #####
FROM node:12-slim AS node
LABEL author="Harry Ho"
RUN mkdir /app
WORKDIR /app
COPY . .

RUN cd  /app
RUN npm install
RUN npm run build-prod


###### Run #####
FROM nginx:alpine
LABEL author="Harry Ho"
WORKDIR /var/cache/nginx
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf


#########################################################
## docker build . -t  nc-prd:2.0
## docker run --publish 8080:80  --name nc2 nc-prd:2.0


