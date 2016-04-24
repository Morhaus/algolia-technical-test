import fs from 'fs';
import algoliasearch from 'algoliasearch';
import { resolve as r } from 'path';
import async from 'async';

import './checkEnv';

const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX } = process.env;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX);

async.eachSeries(
  fs.readdirSync(r('./fixtures')),
  (fixture, next) => {
    const objects = JSON.parse(fs.readFileSync(r('./fixtures', fixture)));
    index.addObjects(objects, err => {
      if (err) {
        next(err);
      } else {
        console.log(`Added ${fixture}`);
        next();
      }
    });
  },
  err => {
    if (err) {
      console.log(err);
    }
  }
);
