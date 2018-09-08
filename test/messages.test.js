const { expect } = require('chai');
const { mockApi } = require('./fixtures');

const messages = require('../models/admin/messages')(mockApi);

describe('messages', () => {
  describe('constructor', () => {
    describe('_formData', () => {
      describe('topic_id is null', () => {
        it('should set the title and the target usernames', () => {
          const target_usernames = ['a', 'b'];
          const title = 'a fake title';
          const m = new messages.Message({ target_usernames, title, topic_id: null });
          expect(m._formData.target_usernames).eq(target_usernames);
          expect(m._formData.title).eq(title);
          expect(m._formData.topic_id).undefined;
        });
      });

      describe('topic_id not null', () => {
        it('should set the topic_id and not the target usernames', () => {
          const target_usernames = ['1', '2'];
          const title = 'a fake title';
          const topic_id = 1234;
          const m = new messages.Message({ target_usernames, title, topic_id });

          expect(m._formData.topic_id).eq(topic_id);
          expect(m._formData.target_usernames).undefined;
          expect(m._formData.title).undefined;
        });
      });
    });
  });
});
