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

### What can be improve

- There is a very strange problem I couldn't resolve, which is the toogle of folders (to show or hide the content of a folder)
- Error messages should be improved, yet there are too generic and not user friendly.
- The environment variables are checked (their presence) (see [here](./src/config/env.ts)) but not their type. This should be checked.