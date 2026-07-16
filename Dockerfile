###### Build #####
FROM node:22-slim AS node
LABEL author="Harry Ho"
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


###### Run #####
FROM nginx:alpine
LABEL author="Harry Ho"
WORKDIR /var/cache/nginx
COPY --from=node /app/dist/ngDemo/browser /usr/share/nginx/html
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf


#########################################################
## docker build . -t nc-demo:3.5
## docker run --publish 8080:80 --name nd3 nc-demo:3.5
