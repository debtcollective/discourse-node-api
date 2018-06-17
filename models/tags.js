/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Tags}
 */

// todo index.d.ts
module.exports = api => ({
  getAll: async () => {
    const raw = await api.authGet('/tags.json')();

    const tags = raw.extras.tag_groups.reduce((tagList, { tags }) => [...tagList, ...tags], []);

    return raw.tags.concat(tags);
  },
});
