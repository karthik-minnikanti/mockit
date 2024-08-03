const express = require('express');
const pullAt = require('lodash/pullAt');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const uuid = require('uuid/v4');

const port = process.env.PORT || 4000;

const { getConfig, writeConfig } = require('./utils/config-helper');

app.use(cors());
app.use(bodyParser.json());

const requiredPropertiesForRoute = [
  'route',
  'httpMethod',
  'statusCode',
  'delay',
  'payload'
];
const isRouteValid = (route, additionalRequiredProperties = []) => {
  const required = requiredPropertiesForRoute.concat(
    additionalRequiredProperties
  );
  return required.every((key) => {
    return route[key] !== undefined;
  });
};

app.post('/route', async (req, res) => {
  const payload = req.body;
  const config = await getConfig();

  const route = {
    id: uuid(),
    ...payload
  };

  if (!isRouteValid(route)) {
    return res.sendStatus(400);
  }

  config.routes.push(route);

  await writeConfig(config);

  res.sendStatus(201);
});

app.put('/route', async (req, res) => {
  const route = req.body;

  if (!isRouteValid(route, ['id'])) {
    return res.sendStatus(400);
  }

  const config = await getConfig();

  const routeIndex = config.routes.findIndex(({ id } = {}) => id === route.id);
  config.routes[routeIndex] = route;

  await writeConfig(config);

  res.sendStatus(204);
});

app.delete('/route', async (req, res) => {
  const payload = req.body;
  const config = await getConfig();

  const { id } = payload;

  if (!id) {
    return res.sendStatus(400);
  }

  const routeIndex = config.routes.findIndex(
    ({ id: routeId } = {}) => routeId === id
  );

  pullAt(config.routes, routeIndex);

  await writeConfig(config);
  return res.sendStatus(204);
});

app.post('/settings', async (req, res) => {
  const payload = req.body;
  const config = await getConfig();

  const { settings = {} } = config;

  const newSettings = {
    ...settings,
    ...payload
  };

  config['settings'] = newSettings;

  await writeConfig(config);
  return res.sendStatus(204);
});

app.get('/route', async (req, res) => {
  const config = await getConfig();
  console.log("-----", config)
  return res.json(config?.routes);
});

// app.get('/route', async (req, res) => {
//   try {
//     const configStream = await getConfig(); // Assume this returns a readable stream

//     // Create a buffer to collect stream data
//     const buffer = [];

//     // Collect the data from the stream
//     configStream.on('data', chunk => buffer.push(chunk));
//     configStream.on('end', () => {
//       // Convert buffer to a single string and then parse it as JSON
//       const configData = JSON.parse(Buffer.concat(buffer).toString());
//       res.json(configData?.routes); // Send the data as JSON
//     });

//     // Handle stream errors
//     configStream.on('error', error => {
//       console.error('Error with stream:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
//   } catch (error) {
//     console.error('Error fetching config:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

if (process.env.ENV !== 'test') {
  server = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
}

module.exports = app;
