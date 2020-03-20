/**
 * @param {discourseApi.DiscourseApiShuttle} api Discourse API instance
 */
module.exports = api => ({
  userBadges: username => api.authGet(`/user-badges/${username}.json`)(),
  /**
   * Assigns a badge to a user
   * Reason must be a valid link to a Discourse post or topic
   * otherwise leave it empty
   */
  assignBadgeToUser: ({ username, badge_id, reason = "" }) =>
    api.authPost(`/user_badges.json`)({ username, badge_id, reason })
});
