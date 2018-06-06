/**
 * @var {discourseApi.discourse}
 */
const discourse = Object.assign(
  config => {
    const {
      api_key,
      api_username = 'system',
      api_url,
      useRateLimiter = false,
      sleepSeconds = 0.75,
    } = config;
    const api = require('./api')({ api_key, api_username, api_url, useRateLimiter, sleepSeconds });

    return {
      tagGroups: require('./models/tagGroups')(api),
      categories: require('./models/categories')(api),
      groups: require('./models/groups')(api),
      topics: require('./models/topics')(api),
      posts: require('./models/posts')(api),
      users: require('./models/users')(api),
      admin: require('./models/admin')(api),
      enums: require('./models/enums'),
      utils: require('./utils/utils'),
    };
  },
  {
    enums: require('./models/enums'),
    utils: require('./utils/utils'),
  },
);

module.exports = discourse;
