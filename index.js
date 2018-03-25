module.exports = ({ api_key, api_username = 'system', apiUrl }) => {
  const api = require('./api')({ api_url, api_username, apiUrl });

  return {
    tagGroups: require('./tagGroups')(api),
    categories: require('./categories')(api),
    groups: require('./groups')(api),
    topics: require('./topics')(api),
    posts: require('./posts')(api),
    enums: require('./enums'),
  };
};
