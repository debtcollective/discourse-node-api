const { expect } = require("chai");
const { mockApi } = require("./fixtures");

const messages = require("../models/admin/messages")(mockApi);

describe("messages", () => {
  describe("constructor", () => {
    describe("_formData", () => {
      describe("topic_id is null", () => {
        it("should set the title and the target recipients", () => {
          const target_recipients = ["a", "b"];
          const title = "a fake title";
          const m = new messages.Message({
            target_recipients,
            title,
            topic_id: null
          });
          expect(m._formData.target_recipients).eq(target_recipients);
          expect(m._formData.title).eq(title);
          expect(m._formData.topic_id).undefined;
        });
      });

      describe("topic_id not null", () => {
        it("should set the topic_id and not the target recipients", () => {
          const target_recipients = ["1", "2"];
          const title = "a fake title";
          const topic_id = 1234;
          const m = new messages.Message({
            target_recipients,
            title,
            topic_id
          });

          expect(m._formData.topic_id).eq(topic_id);
          expect(m._formData.target_recipients).undefined;
          expect(m._formData.title).undefined;
        });

        it("should set the archetype to `regular` if `private_message` is passed", () => {
          const target_recipients = ["1", "2"];
          const title = "a fake title";
          const topic_id = 1234;
          const m = new messages.Message({
            target_recipients,
            title,
            topic_id
          });

          expect(m._formData.topic_id).eq(topic_id);
          expect(m._formData.target_recipients).undefined;
          expect(m._formData.title).undefined;
          expect(m._formData.archetype).eq("regular");
        });
      });
    });
  });
});
