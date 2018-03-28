/**
 * @param {discourseApi.DiscourseApiShuttle} api Discourse API instance
 */
module.exports = api => ({
  getByUsername: username => api.authGet(`/users/${username}.json`)(),
  updateByUsername: username => api.authPut(`/users/${username}.json`)(),
});
