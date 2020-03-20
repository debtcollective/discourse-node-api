const { expect } = require("chai");
const nock = require("nock");
const qs = require("query-string");
const { mockApi: api } = require("./fixtures");

const { api_url, api_key, api_username } = api;

const queried = (uri, body, cb) => cb(null, [200, qs.parseUrl(uri).query]);
const bodied = (uri, body, cb) => cb(null, [200, { body }]);

const returnReq = "/returnReqContent";
const bodyRes = "/bodyResponse";

const bindReturnReq = (n, method) => {
  const r = n[method](returnReq)
    .times(100)
    .query(() => true);

  if (method === "get" || method === "delete") {
    r.reply(queried);
  } else {
    r.reply(bodied);
  }
};

const bindBodyRes = (n, method) => {
  const r = n[method](bodyRes)
    .times(100)
    .query(() => true);

  r.reply((_, __, cb) => cb(null, [200, { fooBar: "20" }]));
};

["get", "put", "post", "delete"].reduce((n, method) => {
  bindReturnReq(n, method);
  bindBodyRes(n, method);
  return n;
}, nock(api_url));

const testAuthHeaders = req => {
  expect(req.header["Api-Key"]).eq(api_key);
  expect(req.header["Api-Username"]).eq(api_username);
};

const testBodiedAuth = ({ body }) => {
  expect(body).include(`name="api_key"\r\n\r\n${api_key}`);
  expect(body).include(`name="api_username"\r\n\r\n${api_username}`);
};

const testExtractBody = response => {
  const body = response.body;

  expect(body.fooBar).exist;
  expect(body.fooBar).eq("20");
};

const doTestNoNull = r =>
  Object.keys(r).forEach(k => {
    expect(r[k]).not.null;
    expect(r[k]).not.eq("null");
  });

const testNoQueriedNull = doTestNoNull;
const testNoBodiedNull = ({ body }) => doTestNoNull(body);

const testCorrectedQueryArray = orig => res => {
  const body = res.body;

  expect(Object.keys(body).length).eq(Object.keys(body).length),
    Object.keys(body).forEach(k => {
      if (Array.isArray(orig[k.replace("[]", "")])) {
        expect(body[k]).eql(orig[k.replace("[]", "")]);
      }
    });
};

describe("api", () => {
  describe("authGet", () => {
    it("should include the credentials in headers", () => {
      const request = api.authGet(returnReq)({ id: 1 });

      testAuthHeaders(request);
    });

    it("should extract the body prop", () => {
      api
        .authGet(bodyRes)()
        .then(testExtractBody);
    });

    it("should not allow nulls in the params", () =>
      api
        .authGet(returnReq)({ twenty: null })
        .then(testNoQueriedNull));

    it("should correctly query array parameters", () => {
      const orig = { arr: ["1", "2", "3"] };

      return api
        .authGet(returnReq)(orig)
        .then(testCorrectedQueryArray(orig));
    });
  });

  describe("authPut", () => {
    it("should include the credentials in headers", () => {
      const request = api.authPut(returnReq)({ id: 1 });

      testAuthHeaders(request);
    });

    it("should extract the body prop", () =>
      api
        .authPut(bodyRes, "fooBar")()
        .then(testExtractBody));

    it("should not allow nulls in the params", () =>
      api
        .authPut(returnReq)({ twenty: null })
        .then(testNoBodiedNull));
  });

  describe("authPost", () => {
    it("should include the credentials in the body", () => {
      const request = api.authPost(returnReq)();

      testAuthHeaders(request);
    });

    it("should extract the body prop", () =>
      api
        .authPost(bodyRes, "fooBar")()
        .then(testExtractBody));

    it("should not allow nulls in the params", () =>
      api
        .authPost(returnReq)({ twenty: null })
        .then(testNoBodiedNull));
  });

  describe("authDelete", () => {
    it("should include the credentials in the query", () => {
      const request = api.authDelete(returnReq)();

      testAuthHeaders(request);
    });

    it("should extract the body prop", () =>
      api
        .authDelete(bodyRes, "fooBar")()
        .then(testExtractBody));

    it("should not allow nulls in the params", () =>
      api
        .authDelete(returnReq)({ twenty: null })
        .then(testNoQueriedNull));

    it("should correctly query array parameters", () => {
      const orig = { arr: ["1", "2", "3"] };

      return api
        .authDelete(returnReq)(orig)
        .then(testCorrectedQueryArray(orig));
    });
  });
});
