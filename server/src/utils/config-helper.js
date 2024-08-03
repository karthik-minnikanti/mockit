const fs = require('fs-extra');
const path = require('path');

const getConfig = async () => {
  console.log("-----", __dirname)
  console.log("-----", path.resolve(__dirname, '../../../mockit-routes/configuration/routes.json') )
  return await fs.readJson(
    path.resolve(__dirname, '../../../mockit-routes/configuration/routes.json')
  );
};

const writeConfig = async (config) => {
  fs.writeJson(
    path.resolve(__dirname, '../../../mockit-routes/configuration/routes.json'),
    config,
    {
      spaces: 4
    }
  );
};

module.exports = {
  getConfig,
  writeConfig
};
