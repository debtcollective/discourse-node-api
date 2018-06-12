/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Tags}
 */

// todo index.d.ts
module.exports = api => ({
  getAll: api.authGet('/tags.json', 'tags'),
});
