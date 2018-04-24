# dash-iq

Custom dashboards and visualizations for AppD analytics data.

## Get started

Install NodeJS. You can either install it from https://nodejs.org/en/download/ or install [nvm](https://github.com/creationix/nvm) first, then run `nvm install v9`

**Install dependencies and start the `frontend`:**

* `cd ../frontend`
* `npm install`
* add info to `src/workflows.json` and `src/enterprises.json`
* create `.env.local` and set `REACT_APP_APPD_SERVER_URL` to point to your server, `REACT_APP_APP_KEY` if you want to restrict which browser app to get metrics from, and `REACT_APP_APPD_SERVER_URL` to point to the controller
* create `.env.development.local` with the same contents of `.env.local` but without `REACT_APP_APPD_SERVER_URL`

**Install dependencies and start the `server`:**

* `cd server`
* `npm install`
* create an file called `.env.local` and set `API_ACCOUNT_NAME` and `API_KEY` (you can look at `.env` for the format)
* `npm start`

Open your browser at [http://localhost:3000](http://localhost:3000).

# Deployment

## Frontend

* `npm run build`
* copy the `build` folder to your production server

You now have static files that can be served with Apache, Nginx, or another web server. A simple way to serve them is:

* `npm install -g serve`
* `serve -s build`

## Backend

* `npm run build`
* Run the server with `API_ACCOUNT_NAME=xxxxxxx API_KEY=xxxxxx node bundle.js`

# Development

If you are using Visual Studio Code, you should install the extensions `ESLint` and `Prettier - Code formatter`

# Contributing

Always feel free to fork and contribute any changes directly via [GitHub](https://github.com/Appdynamics/dash-iq).

# AppDynamics Professional Services

All materials contained herein (the "Materials") are protected by U.S. copyright and other intellectual property laws, and are the proprietary information of AppDynamics LLC. No part of the Materials may be reproduced, distributed or displayed in any form or by any means, or used to make any derivative work (such as a translation or adaptation), without prior written permission from AppDynamics LLC. By using the Materials, you agree not to take any action that would violate the foregoing restrictions or otherwise be detrimental to AppDynamics LLC's intellectual property rights. The term APPDYNAMICS and any logos of AppDynamics are trademarks of AppDynamics LLC.
Copyright © 2018 AppDynamics, Inc. All rights reserved.
