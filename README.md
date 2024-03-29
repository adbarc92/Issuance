# Issuance

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Material UI](https://img.shields.io/badge/materialui-%230081CB.svg?style=for-the-badge&logo=material-ui&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3e?style=for-the-badge&logo=babel&logoColor=black)

## About
An issue tracker for use in debugging or managing projects by small-to-large groups. [Click here to use the live demo!](https://adb-issuance.herokuapp.com/)

## Motivation

I wanted a project which would encourage me to improve at both front-end design and back-end implementation, and this was my destination. I've always wanted more specialized task-tracking software, and this was my first iteration of it.

## Installation & Setup

* Requires a running instance of PostgreSQL
* Requires a `.env` file matching the configuration of the `.env.example`, which requires an IMGUR refresh token, client ID, and client secret
* Requires an `ormconfig` file which specifies all the Postgres database information, including username and password

1. Download the project.
2. Install the dependencies using `yarn`.
3. Run `yarn build` to compile the client-side.
4. Run `yarn start:server` to start the server.
5. Run `yarn start:ui` to start the client.
6. Visit `localhost:3000` to view the results!

## Features

* Sends users notifications when assigned tasks are posted or updated via Socket.IO

## Usage

* Create a user using the custom authentication to log-in.
* All users share the same set of projects and tasks.
* Navigate using the drawer on the left-side.

## Demo

![Demo](https://user-images.githubusercontent.com/42557448/135191878-46292bbf-ace6-4e81-90cd-eff4ff5f5a54.gif)

## ChangeLog && Roadmap

April 2021 - Version 1.0 Released

**Future Plans**
* Improve dashboard
* Differentiate task and project ownership based on user accounts

