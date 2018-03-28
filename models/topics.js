/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Topics}
 */
module.exports = api => ({
  get: id => api.authGet(`/t/${id}.json`)(),
  update: t => api.authPut(`/t/${t.slug}/${t.id}.json`)(t),
  getPostId: ({ post_stream: { posts: [{ id }] } }) => id,
});
