const superagent = require("superagent");
const {
  paramsAsPropOf,
  extractBody,
  noObjects,
  splitProps
} = require("./utils/utils");
const qs = require("qs");

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

/**
 * Makes a POST/PUT request with Content-Type set to application/json
 * This is the default in superagent
 */
const makeBodiedRequest = (req, params, auth) => {
  return req
    .use(log)
    .set("Api-Key", auth.api_key)
    .set("Api-Username", auth.api_username)
    .send(params);
};

const makeQueriedRequest = (req, params, auth) => {
  return req
    .use(log)
    .set("Api-Key", auth.api_key)
    .set("Api-Username", auth.api_username)
    .query({
      ...fixParams(params)(pullDeleting("asPropOf", params))
    });
};

/**
 * Constructs an instance of the Discourse API
 * @param {discourseApi.DiscourseApiConfiguration} config API configuration parameters
 *
 * @return {discourseApi.DiscourseApiShuttle}
 */
module.exports = config => {
  const { api_key, api_username = "system", api_url } = config;
  const fixUrl = url => `${!url.startsWith(api_url) ? api_url : ""}${url}`;
  const auth = Object.freeze({ api_key, api_username });

  const sa = superagent.agent();

  const authGet = url => (params = {}) => {
    const apiEndpoint = fixUrl(url);

    return makeQueriedRequest(sa.get(apiEndpoint), params, auth);
  };

  const authPost = url => (body = {}) => {
    const apiEndpoint = fixUrl(url);

    return makeBodiedRequest(sa.post(apiEndpoint), body, auth);
  };

  const authPut = url => (body = {}) => {
    const apiEndpoint = fixUrl(url);

    return makeBodiedRequest(sa.put(apiEndpoint), body, auth);
  };

  const authDelete = url => (params = {}) => {
    const apiEndpoint = fixUrl(url);

    return makeQueriedRequest(sa.delete(apiEndpoint), params, auth);
  };

  return { authGet, authPost, authPut, authDelete };
};
