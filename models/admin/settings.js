/**
 * @param {discourseApi.DiscourseApiShuttle} api
 */
module.exports = api => ({
  enableTags: enable => api.authPut('/admin/site_settings/tagging_enabled')({ tagging_enabled: enable }),
});
