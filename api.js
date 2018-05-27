const superagent = require('superagent');
const { paramsAsPropOf, extractBody, noObjects, splitProps } = require('./utils');
const qs = require('qs');

const suppressLogs = process.env.DISCOURSE_NODE_SUPPRESS_LOGS == 1;

/**
 * Superagent middleware to log request metadata
 * @param {discourseApi.Req} req
 */
const log = req => {
  if (!suppressLogs) {
    const { method, url, data, headers } = req.toJSON();
    console.info(method, url);
    if (data) console.info(data);
    if (headers) console.info(JSON.stringify(headers));
  }
};

/**
 * Ensure no nulls, array parameters are correctly formatted
 * and all parameters are listed as properties of some entity
 *
 * @param {params: discourseApi.Params} params The params to clean
 * @return {(asPropOf: string) => discourseApi.Params} The cleaned params
 */
const fixParams = params => asPropOf => {
  const ps = noObjects(paramsAsPropOf(params)(asPropOf));
  if (Object.keys(ps).length && !suppressLogs) {
    console.info(ps);
  }
  return ps;
};

const splitBodyProps = body => Promise.resolve(splitProps(Array.isArray, body));

/**
 * Deletes and returns the value of the property from obj
 * @param {string} prop Name of property to return and delete from obj
 * @param {Object} obj Object from which to delete the property
 */
const pullDeleting = (prop, obj) => {
  const v = obj[prop];
  delete obj[prop];
  return v;
};

const sleep = (exports.sleep = (seconds = 0.75) => {
  const ms = seconds * 1000;
  const start = Date.now();
  while (Date.now() - start < ms) {}
});

// use to avoid tripping the discourse request limiter
const sleepAsync = seconds =>
  new Promise(res => {
    sleep(seconds);
    res();
  });

const defaultSleepSeconds = 1;

const makeBodiedRequest = function makeBodiedRequest(req, bodyProp, body, auth) {
  return sleepAsync(defaultSleepSeconds).then(() => {
    const string = qs.stringify(body);
    req
      .use(log)
      .query(string)
      .field(auth);
    return extractBody(req)(bodyProp);
  });
};

const makeQueriedRequest = (req, bodyProp, params, auth) =>
  sleepAsync(defaultSleepSeconds).then(() =>
    extractBody(req.use(log).query({ ...fixParams(params)(pullDeleting('asPropOf', params)), ...auth }))(bodyProp),
  );

/**
 * Constructs an instance of the Discourse API
 * @param {discourseApi.DiscourseApiConfiguration} config API configuration parameters
 *
 * @return {discourseApi.DiscourseApiShuttle}
 */
module.exports = config => {
  const { api_key, api_username = 'system', api_url } = config;
  const fixUrl = url => `${!url.startsWith(api_url) ? api_url : ''}${url}`;
  const auth = Object.freeze({ api_key, api_username });

  const sa = superagent.agent();

  const authGet = (url, bodyProp = null) => (params = {}) =>
    !url.startsWith(api_url)
      ? authGet(fixUrl(url), bodyProp)(params)
      : makeQueriedRequest(sa.get(url), bodyProp, params, auth);

  const authPost = (url, bodyProp = null) => (body = {}) =>
    !url.startsWith(api_url)
      ? authPost(fixUrl(url), bodyProp)(body)
      : makeBodiedRequest(sa.post(url), bodyProp, body, auth);

  const authPut = (url, bodyProp = null) => (body = {}) =>
    !url.startsWith(api_url)
      ? authPut(fixUrl(url), bodyProp)(body)
      : makeBodiedRequest(sa.put(url), bodyProp, body, auth);

  const authDelete = (url, bodyProp = null) => (params = {}) =>
    !url.startsWith(api_url)
      ? authDelete(fixUrl(url), bodyProp)(params)
      : makeQueriedRequest(sa.delete(url), bodyProp, params, auth);

  return { authGet, authPost, authPut, authDelete };
};
