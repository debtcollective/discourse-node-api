/**
 * @param {DiscourseApi.DiscourseApiShuttle} api
 * @return {DiscourseApi.Posts}
 */
module.exports = api => ({
  get: id => api.authGet(`/posts/${id}.json`)(),
  // post[raw] is the only update-able field on a post.
  // putting the whole thing breaks superagent
  update: p => api.authPut(`/posts/${p.id}`)({ raw: p.raw, wiki: p.wiki, asPropOf: 'post' }),
});
