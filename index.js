/**
 * @var {discourseApi.discourse}
 */
const discourse = Object.assign(
  config => {
    const { api_key, api_username = 'system', api_url } = config;
    const api = require('./api')({ api_key, api_username, api_url });

    return {
      tagGroups: require('./tagGroups')(api),
      categories: require('./categories')(api),
      groups: require('./groups')(api),
      topics: require('./topics')(api),
      posts: require('./posts')(api),
    };
  },
  {
    enums: require('./enums'),
    utils: require('./utils'),
  },
);

module.exports = discourse;
