# Frontend - Dropbox-like-rust

## Getting started

### Installation

1. Follow the [backend installation step](../backend/README.md)
2. Make sure to have [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

### Quickstart

1. Follow the [backend quickstart step](../backend/README.md)
2. Setup the environment
```bash
cp .env.example .env
```
3. Install the dependencies
```
npm install
```
4. Run the web application
```
npm run dev
```

### Usage

Go to http://localhost:3000 and organise your directories!

## How does it work

React TS is used, with the build tool Vite and Tailwindcss.

## Notes

### What can be improved

- Problem with the toogle of folders (to show or hide the content of a folder). Very strange and needs further investigation. It works if the data is hard-coded, not if the data is fetched using the API (but if we hard code the data from the API, it works).
- Error messages should be improved, yet there are too generic and not user friendly.
- Problem to get the environment veriables, `VITE_BACKEND_URL` cannot be found (but `VITE_PORT` can be found for instance, see [here](./vite.config.ts)). That's very strange and needs further investigation. For now, the value is hard-coded, see [here](./src/config/env.ts).