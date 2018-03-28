/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Groups}
 */
module.exports = api => ({
  get: api.authGet('/groups/search.json'),
  create: g => api.authPost('/admin/groups')({ ...g, asPropOf: 'group' }),
  update: g => api.authPut(`/admin/groups/${g.id}`)({ ...g, asPropOf: 'group' }),
  getUsers: groupName => api.authGet(`/groups/${groupName}/members.json`)(),
});
