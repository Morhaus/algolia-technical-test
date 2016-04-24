import { resolve as r } from 'path';
import express from 'express';
import proxy from 'proxy-middleware';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import './checkEnv';
import createWebpackConfig from './createWebpackConfig';
import createServer from '../src/createServer';

const {
  PORT, ALGOLIA_APP_ID, ALGOLIA_INDEX, ALGOLIA_ADMIN_KEY,
  ALGOLIA_SEARCH_KEY, DEV_SERVER, DEV_PORT, NODE_ENV,
} = process.env;

const port = PORT || 8080;

const app = createServer({
  algoliaAppId: ALGOLIA_APP_ID,
  algoliaIndex: ALGOLIA_INDEX,
  algoliaAdminKey: ALGOLIA_ADMIN_KEY,
});

let assetsMiddleware;
if (DEV_SERVER) {
  const devPort = DEV_PORT || 9090;
  const publicPath = `http://localhost:${devPort}/`;

  const config = createWebpackConfig({
    entry: r('./src/client/entry.js'),
    output: {
      filename: 'app.js',
      path: r('./dist'),
      publicPath,
    },
    env: NODE_ENV,
    hot: true,
    vars: {
      ALGOLIA_APP_ID,
      ALGOLIA_SEARCH_KEY,
      ALGOLIA_INDEX,
      NODE_ENV: NODE_ENV || 'development',
    },
  });

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    contentBase: config.output.path,
    hot: true,
    publicPath,
  });

  server.listen(devPort, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Dev server listening at ${publicPath}`);
    }
  });
  assetsMiddleware = proxy(publicPath);
} else {
  assetsMiddleware = express.static(r('./dist'));
}

app.use('/assets', assetsMiddleware);

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening at http://localhost:${port}`);
  }
});
