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
    none: 0,
    entry: 1,
    moderator: 2,
    collectiveAdmin: 3,
    platformAdmin: 4,
  },
};
