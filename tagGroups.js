/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.TagGroups}
 */
module.exports = api => ({
  getAll: api.authGet('/tag_groups.json', 'tag_groups'),
  update: tg => api.authPut(`/tag_groups/${tg.id}.json`, 'tag_group')(tg),
  create: api.authPost('/tag_groups.json', 'tag_group'),
  differ: (seed, existing) =>
    !seed.tag_names.every(tg => existing.tag_names.includes(tg)) || seed.one_per_topic !== existing.one_per_topic,
});
