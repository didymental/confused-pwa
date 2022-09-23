# Front End for Confused App

This repo contains the code running the front end logic for Confused.

The front end has been deployed onto Vercel.

The front end can be accessed via: https://confusedsession.vercel.app/

## Set Up Instructions for Local

0. Install Node Version 14.16.0 from the [official website](https://nodejs.org/en/) or using node version managers such as [nodenv](https://www.npmjs.com/package/nodenv).

1. Install all package dependencies using `npm`.

```
npm install
```

2. Start the server and see the page at http://localhost:3000

```
npm start
```

3. If you are not running a local backend server and would like to use the online server at https://confused-backend-3216.herokuapp.com, remove the line below in `.env.deveopment`:

```
REACT_APP_BASE_URL='http://localhost:8000'
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
