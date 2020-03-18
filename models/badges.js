/**
 * @param {discourseApi.DiscourseApiShuttle} api Discourse API instance
 */
module.exports = api => ({
  userBadges: username => api.authGet(`/user-badges/${username}.json`)(),
  assignBadgeToUser: ({ username, badge_id, reason }) =>
    api.authPost(`/user_badges.json`)({ username, badge_id, reason }),
});
