/**
 * @type {discourseApi.Enums}
 */
module.exports = {
  visibility: {
    nobody: 0,
    onlyAdmins: 1,
    modsAndAdmins: 2,
    membersModsAndAdmins: 3,
    everyone: 99,
  },
  trust: {
    new: 0,
    basic: 1,
    member: 2,
    regular: 3,
    leader: 4, // moderators and admins. The only trust level that must be manually granted
  },
  permission: {
    create_reply_see: 1,
    reply_see: 2,
    see: 3,
  },
  notification: {
    muted: 0,
    regular: 1,
    tracking: 2,
    watching: 3,
    watching_first_post: 4,
  },
};
