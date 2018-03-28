const api_url = 'http://localhost:8080';
const api_username = 'someUser';
const api_key = 'super secret key';

const api = require('../api')({ api_url, api_username, api_key });

const { expect } = require('chai');
const nock = require('nock');
const qs = require('query-string');

const queried = (uri, body, cb) => cb(null, [200, qs.parseUrl(uri).query]);
const bodied = (uri, body, cb) => cb(null, [200, { body }]);

const returnReq = '/returnReqContent';
const bodyRes = '/bodyResponse';

const bindReturnReq = (n, method) => {
  const r = n[method](returnReq)
    .times(100)
    .query(() => true);

  if (method === 'get' || method === 'delete') {
    r.reply(queried);
  } else {
    r.reply(bodied);
  }
};

const bindBodyRes = (n, method) => {
  const r = n[method](bodyRes)
    .times(100)
    .query(() => true);

  r.reply((_, __, cb) => cb(null, [200, { fooBar: '20' }]));
};

['get', 'put', 'post', 'delete'].reduce((n, method) => {
  bindReturnReq(n, method);
  bindBodyRes(n, method);
  return n;
}, nock(api_url));

const testQueriedAuth = res => {
  expect(res.api_key).eq(api_key);
  expect(res.api_username).eq(api_username);
};

const testBodiedAuth = ({ body }) => {
  expect(body).include(`name="api_key"\r\n\r\n${api_key}`);
  expect(body).include(`name="api_username"\r\n\r\n${api_username}`);
};

const testExtractBody = fooBar => {
  expect(fooBar).exist;
  expect(fooBar).eq('20');
};

const doTestNoNull = r =>
  Object.keys(r).forEach(k => {
    expect(r[k]).not.null;
    expect(r[k]).not.eq('null');
  });

const testNoQueriedNull = doTestNoNull;
const testNoBodiedNull = ({ body }) => doTestNoNull(body);

const testCorrectedQueryArray = orig => r => (
  // Subtract 2 for the auth parameters
  expect(Object.keys(r).length - 2, "Response did not contain all of original's properties").eq(
    Object.keys(orig).length,
  ),
  Object.keys(r).forEach(k => {
    if (Array.isArray(orig[k.replace('[]', '')])) {
      expect(r[k]).eql(orig[k.replace('[]', '')]);
    }
  })
);

const testCorrectedBodyArray = orig => ({ body }) => {
  Object.keys(orig).forEach(k => {
    const v = orig[k];
    const regexStr = `${k}\\[\\]"\r\n\r\n(.*?)\r\n`;
    const foundTimes = body.match(new RegExp(regexStr, 'g')).length;
    expect(foundTimes).eq(v.length);
    const toExec = new RegExp(regexStr, 'gi');
    for (let i = 0; i < foundTimes; i++) {
      const matched = toExec.exec(body);
      expect(matched[1]).eq(v[i]);
    }
  });
};

describe('api', () => {
  describe('authGet', () => {
    it('should include the credentials in the query', () =>
      api
        .authGet(returnReq)()
        .then(testQueriedAuth));

    it('should extract the body prop', () =>
      api
        .authGet(bodyRes, 'fooBar')()
        .then(testExtractBody));

    it('should not allow nulls in the params', () =>
      api
        .authGet(returnReq)({ twenty: null })
        .then(testNoQueriedNull));

    it('should correctly query array parameters', () => {
      const orig = { arr: ['1', '2', '3'] };
      return api
        .authGet(returnReq)(orig)
        .then(testCorrectedQueryArray(orig));
    });
  });

  describe('authPut', () => {
    it('should include the credentials in the body', () =>
      api
        .authPut(returnReq)()
        .then(testBodiedAuth));

    it('should extract the body prop', () =>
      api
        .authPut(bodyRes, 'fooBar')()
        .then(testExtractBody));

    it('should not allow nulls in the params', () =>
      api
        .authPut(returnReq)({ twenty: null })
        .then(testNoBodiedNull));

    it('should correctly payload array parameters', () => {
      const orig = { arr: ['1', '2', '3'] };
      return api
        .authPut(returnReq)(orig)
        .then(testCorrectedBodyArray(orig));
    });
  });

  describe('authPost', () => {
    it('should include the credentials in the body', () =>
      api
        .authPost(returnReq)()
        .then(testBodiedAuth));

    it('should extract the body prop', () =>
      api
        .authPost(bodyRes, 'fooBar')()
        .then(testExtractBody));

    it('should not allow nulls in the params', () =>
      api
        .authPost(returnReq)({ twenty: null })
        .then(testNoBodiedNull));

    it('should correctly payload array parameters', () => {
      const orig = { arr: ['1', '2', '3'] };
      return api
        .authPost(returnReq)(orig)
        .then(testCorrectedBodyArray(orig));
    });
  });

  describe('authDelete', () => {
    it('should include the credentials in the query', () =>
      api
        .authDelete(returnReq)()
        .then(testQueriedAuth));

    it('should extract the body prop', () =>
      api
        .authDelete(bodyRes, 'fooBar')()
        .then(testExtractBody));

    it('should not allow nulls in the params', () =>
      api
        .authDelete(returnReq)({ twenty: null })
        .then(testNoQueriedNull));

    it('should correctly query array parameters', () => {
      const orig = { arr: ['1', '2', '3'] };
      return api
        .authDelete(returnReq)(orig)
        .then(testCorrectedQueryArray(orig));
    });
  });
});
