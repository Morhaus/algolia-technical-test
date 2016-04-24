import webpack from 'webpack';
import { resolve as r } from 'path';

import './checkEnv';
import createWebpackConfig from './createWebpackConfig';

const config = createWebpackConfig({
  entry: r('./src/client/entry.js'),
  output: {
    filename: 'app.js',
    path: r('./dist'),
  },
  env: process.env.NODE_ENV,
  vars: {
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
    ALGOLIA_INDEX: process.env.ALGOLIA_INDEX,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});

webpack(config, (err, stats) => {
  console.log(stats.toString({ colors: true }));
});
