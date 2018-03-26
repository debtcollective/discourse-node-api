/**
 * @param {DiscourseApi.DiscourseApiShuttle} api
 * @return {DiscourseApi.Categories}
 */
module.exports = api => ({
  getAll: () =>
    api
      .authGet('/categories.json', 'category_list')()
      .then(({ categories }) => categories),
  create: api.authPost('/categories.json', 'category'),
  update: cat => api.authPut(`/categories/${cat.id}`)(cat),
  getAboutTopic: cat => api.authGet(`/t/${cat.topic_url.split('/').slice(-1)[0]}.json`)(),
  permissionsMatch: (seed, existing) => {
    const seedPerms = Object.keys(seed).filter(k => k.startsWith('permissions'));
    const existingPerms = Object.keys(existing).filter(k => k.startsWith('permissions'));
    return seedPerms.length === existingPerms.length && seedPerms.every(s => existingPerms.includes(s));
  },
  stripPermissions: cat =>
    Object.keys(cat).reduce(
      (newC, k) => ({
        ...newC,
        ...(k.startsWith('permissions') ? {} : { [k]: cat[k] }),
      }),
      {},
    ),
});
