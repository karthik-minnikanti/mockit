const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const cors = require('cors');
const axios = require("axios")

const port = process.env.PORT || 3000;

const delayMiddleware = require('./middlewares/delay');
const chaosMonkeyMiddleware = require('./middlewares/chaos-monkey');
const basicAuth = require('./middlewares/basic-auth');

const data = fs.readJsonSync(
  path.resolve(__dirname, '../configuration/routes.json')
);
const {
  routes,
  settings: { features: { cors: corsFeature } = {} } = {}
} = data;

app.use(basicAuth);
app.use(delayMiddleware);
app.use(chaosMonkeyMiddleware);

if (corsFeature) {
  app.use(cors());
}

app.use(express.json());

app.disable('x-powered-by');

routes.forEach((route) => {
  const {
    route: path,
    statusCode,
    payload,
    disabled = false,
    httpMethod = 'GET',
    headers = [],
    conditions,
    proxyUrl
  } = route;

  const method = httpMethod.toLowerCase();

  if (!disabled) {
    app[method](path, async (req, res) => {
      let isConditionMet = false;
      let response = null;
    
      for (const conditionData of conditions) {    
        if (JSON.stringify(req.body)?.includes(conditionData?.condition)) {
          isConditionMet = true;
          response = conditionData.responses[0]?.body;
          break;
        }
      }
    
      if (isConditionMet) {
        return res.status(statusCode).send(response);
      } else {
        if(proxyUrl) {

          const proxyResponse = await axios({
            method: method,
            url: proxyUrl,
            data: req.body,
            headers: req.headers
          });

          return res.status(proxyResponse.status).send(proxyResponse.data)
        } else {
          res.status(200).send(payload);
        }

      }
    });
  }
});

if (process.env.ENV !== 'test') {
  server = app.listen(port, () =>
    console.log(`MockIt app listening on port ${port}!`)
  );
}

module.exports = app;
