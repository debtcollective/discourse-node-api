module.exports = ({ api_key, api_username = 'system', api_url }) => {
  const api = require('./api')({ api_key, api_username, api_url });

  return {
    tagGroups: require('./tagGroups')(api),
    categories: require('./categories')(api),
    groups: require('./groups')(api),
    topics: require('./topics')(api),
    posts: require('./posts')(api),
    enums: require('./enums'),
  };
};
