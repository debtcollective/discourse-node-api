const message = api =>
  class Message {
    constructor({
      target_usernames,
      raw,
      title,
      unlist_topic = false,
      is_warning = false,
      archetype = 'private_message',
      nested_post = true,
      typing_duration_msecs = 1,
      composer_duration_open_msecs = 1,
    }) {
      this._api = api;

      this._formData = {
        target_usernames,
        raw,
        title,
        unlist_topic,
        is_warning,
        archetype,
        nested_post,
        typing_duration_msecs,
        composer_duration_open_msecs,
      };
    }

    send() {
      return this._api.authPost('/posts')({ ...this._formData });
    }
  };

module.exports = api => {
  const Message = message(api);
  return {
    Message,
    create: config => new Message(config).send(),
  };
};
