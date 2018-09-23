/**
 * @param {discourseApi.DiscourseApiShuttle} api
 * @return {discourseApi.Topics}
 */
module.exports = api => ({
  get: id => api.authGet(`/t/${id}.json`)(),
  update: t => api.authPut(`/t/${t.slug}/${t.id}.json`)(t),
  getPostId: ({
    post_stream: {
      posts: [{ id }],
    },
  }) => id,
  /**
   * Invite the passed in users or groups or email
   * @param {number} topicId The topic id to invite to
   * @param {?string} options.user An optional username
   * @param {?string[]} options.groupNames An optional list of group names
   * @param {?string} options.customMessage An optional custom message
   * @param {?string} options.email An optional email
   * @return {Promise<any>} A promise representing the resolved request
   */
  invite: (topicId, { user, groupNames, customMessage, email }) =>
    api.authPost(`/t/${topicId}/invite`)({
      ...(user ? { user } : {}),
      ...(groupNames ? { group_names: groupNames } : {}),
      ...(customMessage ? { custom_message: customMessage } : {}),
    }),

  removeAllowedUser: (topicId, username) =>
    api.authPut(`/t/${topicId}/remove-allowed-user`)({ username }),
});
