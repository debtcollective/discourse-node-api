module.exports = ({ authGet, authPost, authPut, authDelete }) => ({
  get: id => authGet(`/posts/${id}.json`)(),
  // post[raw] is the only update-able field on a post.
  // putting the whole thing breaks superagent
  update: p => authPut(`/posts/${p.id}`)({ raw: p.raw, wiki: p.wiki, asPropOf: 'post' }),
});
