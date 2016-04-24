# Algolia Technical Test

## Bootstrap

```sh
# Add ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID and ALGOLIA_INDEX
# to your environment.

git clone https://github.com/Morhaus/algolia-technical-test
cd algolia-technical-test
npm install
npm run load-fixtures

# In production:
NODE_ENV=production npm run build
NODE_ENV=production npm run start

# In development:
DEV_SERVER=true npm start
```

## Commands

* `npm start` starts the server.
* `npm run demon` starts the server and restarts automatically on file change.
* `npm run build` builds all assets.
$ `npm run load-fixtures` adds all objects under `fixtures/` to the index.

## Configuration

Please provide the following environment variables when running commands:

* `ALGOLIA_SEARCH_KEY` (mandatory) Search-only Algolia API key.
* `ALGOLIA_ADMIN_KEY` (mandatory) Admin Algolia API key.
* `ALGOLIA_APP_ID` (mandatory) Algolia application ID.
* `ALGOLIA_INDEX` (mandatory) Algolia index name.
* `PORT` Server port. Defaults to `8080`.
* `NODE_ENV` When set to `production`, all assets are minified.
* `DEV_SERVER` Start the server in development mode: assets are rebuilt automatically, hot reloading is enabled.
* `DEV_PORT` Development server port. Defaults to `9090`.
