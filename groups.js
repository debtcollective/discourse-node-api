module.exports = ({ authGet, authPost, authPut, authDelete }) => ({
  get: authGet('/groups/search.json'),
  create: g => authPost('/admin/groups')({ ...g, asPropOf: 'group' }),
  update: g => authPut(`/admin/groups/${g.id}`)({ ...g, asPropOf: 'group' }),
});
