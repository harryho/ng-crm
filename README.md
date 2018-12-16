# Angular Material Design App

> A reusable CRM starter project for real-world business based on Angular 5, Angular-Material 5.

This project starts from a popular starter project [AngularClass/AngularStarter](https://github.com/AngularClass/angular-starter). The goal of this project is to create reusable project for real-world business. To achieve this target, we need a solution which includes simple authentication process, restful API feature with token support and simple but elegant UI design.

#### Features

* This project is built on the top of AngularClass/Angular-Starter.
* The UI part of this project is comprehensively built on Angular Material.
* This project includes ng-charts, progress-bar, confirmation dialog, etc.
* ~~~To simulate real-world business, this starter project chooses Json-Server as fake Restful API. (You can simple replace it with your own API).~~~
* Fake API is just readonly fake service.
* CRUD functions for Customer, Order and Product


#### Live Demo
[Demo App](https://angular-app-demo.harryho.org): The demo is just a proof of concept. It doesn't have back-end API and all features of master branch.

#### Screenshots

![Screenshot1](screenshots/screenshot-1.JPG)

![Screenshot2](screenshots/screenshot-2.JPG)

![Screenshot3](screenshots/screenshot-3.JPG)

![Screenshot4](screenshots/screenshot-4.JPG)

## Build & Setup

```bash
# Clone project
git clone https://github.com/harryho/ng-md-app.git


# prepare Json-Server as fake Restful API
cd ng-md-app

# WINDOWS only. In terminal as administrator
npm install -g node-pre-gyp

# install the packages with npm
npm install

# Or use yarn (recommended)
yarn

# start the app
npm run demo
# or
yarn demo 

# development
npm run server:dev
# or
yarn server:dev

# serve with hot reload at localhost:3000
npm run server:dev:hmr
# or
yarn server:dev:hmr

# build for production 
npm run build:prod

# run as production
npm run server:prod



```

# Welcome to fork or clone!

For detailed explanation on how things work, checkout following links please.

* [angular](https://angular.io/)
* [angular-material](https://material.angular.io/)
* [ng-charts](https://github.com/valor-software/ng2-charts)

#### Alternatives

There are some similar projects respectively built on the Vue.js and React. If you have interests in those technical stacks. You can find and clone those repositories below.

* [Vue2Crm](https://github.com/harryho/vue2crm.git).
* [React-Crm](https://github.com/harryho/react-crm.git).


###  Change log

* Rebase demo branch to master

  New master doesn't rely on Json-Server as fake API. It will only have Readonly fake API. It means any new or updated data will be stored to any physical file. All test data will be rolled back after system restart.

* Create an archived branch json-server

  This branch was the master which used Json-Server as fake API. Considering the hiccup of setting Json-Server up and maintenance, it will be replaced by fake service ( Readonly fake API). You still can find clone this branch by branch name __json-server__, but it will be no longer updated. It is an archived branch.
