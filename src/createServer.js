import express from 'express';
import { resolve as r } from 'path';
import algoliasearch from 'algoliasearch';
import Joi from 'joi';
import bodyParser from 'body-parser';

import categories from './categories';

export default function createServer({
  algoliaAppId,
  algoliaAdminKey,
  algoliaIndex,
}) {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const client = algoliasearch(algoliaAppId, algoliaAdminKey);
  const index = client.initIndex(algoliaIndex);

  index.setSettings({
    attributesForFaceting: ['category'],
    customRanking: ['asc(rank)'],
  });

  const appSchema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    image: Joi.string().uri().required(),
    link: Joi.string().uri().required(),
    category: Joi.string().valid(categories).required(),
    rank: Joi.number().integer().min(1).required(),
  });

  app.get('/', (req, res) => {
    res.sendFile(r('./static/index.html'));
  });

  app.post('/api/1/apps', (req, res) => {
    Joi.validate(req.body, appSchema, (err, value) => {
      if (err) {
        res.status(400).json({
          error: err.details.map(e => e.message).join('\n'),
        });
        return;
      }
      index.addObject(value, (err2, content) => {
        if (err) {
          res.status(500).json({ error: err2 });
        } else {
          res.status(201).json(content.objectID);
        }
      });
    });
  });

  app.delete('/api/1/apps/:id', (req, res) => {
    index.deleteObject(req.params.id, err => {
      if (err) {
        res.status(404).json({ error: err });
      } else {
        res.status(204).end();
      }
    });
  });

  return app;
}
