/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Posts}
 */
module.exports = api => ({
  get: id => api.authGet(`/posts/${id}.json`)(),
  // post[raw] is the only update-able field on a post.
  // putting the whole thing breaks superagent
  update: p => api.authPut(`/posts/${p.id}`)({ post: { raw: p.raw, wiki: p.wiki } }),
});
