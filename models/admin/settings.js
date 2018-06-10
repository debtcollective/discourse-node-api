/**
 * @param {discourseApi.DiscourseApiShuttle} api
 */

const path = '/admin/site_settings/';

module.exports = api => ({
  enableTags: enable => api.authPut(path + 'tagging_enabled')({ tagging_enabled: enable }),
  enableSsoProvider: enable =>
    api.authPut(path + 'enable_sso_provider')({ enable_sso_provider: enable }),
  setSsoSecret: sso_secret => api.authPut(path + 'sso_secret')({ sso_secret }),
});
