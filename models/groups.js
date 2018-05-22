/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Groups}
 */
module.exports = api => ({
  get: api.authGet('/groups/search.json'),
  create: g => api.authPost('/admin/groups')({ group: g }),
  update: g => api.authPut(`/admin/groups/${g.id}`)({ group: g }),
  getMembers: groupName => api.authGet(`/groups/${groupName}/members.json`)(),
});
