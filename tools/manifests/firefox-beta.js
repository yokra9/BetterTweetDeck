const config = require('config');
const _ = require('lodash');
const {DateTime} = require('luxon');

const isCi = !_.isUndefined(process.env.TRAVIS_BRANCH);
const betaId = isCi ? process.env.FIREFOX_BETA_ID : config.get('FirefoxBetaId');

module.exports = {
  ...require('./common.js'),
  version: DateTime.local().toFormat('yy.MdHH.mm'),
  optional_permissions: ['tabs'],
  applications: {
    gecko: {
      id: betaId,
      strict_min_version: '84.0',
    },
  },
};
