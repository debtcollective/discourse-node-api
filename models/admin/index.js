/**
 * @param {discourseApi.DiscourseApiShuttle} api Discourse API instance
 */
module.exports = api => ({
  users: require('./users')(api),
  messages: require('./messages')(api),
});
