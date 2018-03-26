const superagent = require('superagent');

/**
 * Superagent middleware to log request metadata
 * @param {discourseApi.Req} req
 */
const log = req => {
  const { method, url, data, headers } = req.toJSON();
  console.info(method, url);
  if (data) console.info(data);
  if (headers) console.info(JSON.stringify(headers));
};

/**
 * Ensures no null properties exist which break form-data
 * @param {Object} obj
 * @return {Object}
 */
const noNulls = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

/**
 * Fixes array properties for form-data
 * @param {discourseApi.Params} params Params to fix array properties of
 */
const fixArrParam = params =>
  Object.keys(params).reduce(
    (fixed, key) => ({
      ...fixed,
      ...(Array.isArray(params[key])
        ? params[key].reduce((acc, curr) => ({ [`${key}[]`]: curr }), {})
        : { [key]: params[key] }),
    }),
    {},
  );

/**
 * Must always be called after fixArrParam otherwise the typeof x === 'object' will be deceiving
 * @param {discourseApi.Params} params
 * @return {discourseApi.Params} params but without any object properties
 */
const noObjectParams = params =>
  Object.keys(params).reduce(
    (fixed, key) => ({
      ...fixed,
      ...(typeof params[key] === 'object' ? {} : { [key]: params[key] }),
    }),
    {},
  );

/**
 * Prepends asPropOf to all properties of params for form-data. For example,
 * if given `{ foo: 'bar' }` for `params` and `'bang'` for `asPropOf`, it will
 * return `{ 'bang[foo]': 'bar' }`.
 *
 * @param {discourseApi.Params} params The parameters to cast as properties of asPropOf
 * @return {(asPropOf: string) => discourseApi.Params}
 */
const paramsAsPropOf = params => asPropOf =>
  asPropOf
    ? Object.keys(params).reduce(
        (ps, k) => ({
          ...ps,
          [`${asPropOf}[${k}]`]: params[k],
        }),
        {},
      )
    : params;

/**
 * Ensure no nulls, array parameters are correctly formatted
 * and all parameters are listed as properties of some entity
 *
 * @param {params: discourseApi.Params} params The params to clean
 * @return {(asPropOf: string) => discourseApi.Params} The cleaned params
 */
const fixParams = params => asPropOf => {
  const ps = noObjectParams(fixArrParam(paramsAsPropOf(params)(asPropOf)));
  if (Object.keys(ps).length) {
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
 * Returns a function taking a property name to extract from a request
 * @param {Promise<Object>} req The request from which to extract the body property
 * @return {(prop: String) => Promise<any>} The extracted property
 */
const extractBody = req => prop => req.then(({ body }) => (prop ? body[prop] : body));

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
      : extractBody(
          sa
            .get(url)
            .use(log)
            .query({ ...fixParams(params)(pullDeleting('asPropOf', params)), ...auth }),
        )(bodyProp);

  const authPost = (url, bodyProp = null) => (body = {}) =>
    !url.startsWith(api_url)
      ? authPost(fixUrl(url))(body)
      : extractBody(
          sa
            .post(url)
            .use(log)
            .field({ ...fixParams(body)(pullDeleting('asPropOf', body)), ...auth }),
        )(bodyProp);

  const authPut = (url, bodyProp = null) => (body = {}) =>
    !url.startsWith(api_url)
      ? authPut(fixUrl(url))(body)
      : extractBody(
          sa
            .put(url)
            .use(log)
            .field({ ...fixParams(body)(pullDeleting('asPropOf', body)), ...auth }),
        )(bodyProp);

  const authDelete = (url, bodyProp = null) => (params = {}) =>
    !url.startsWith(api_url)
      ? authDelete(fixUrl(url))(params)
      : extractBody(
          sa
            .delete(url)
            .use(log)
            .query({ ...fixParams(params)(pullDeleting('asPropOf', params)), ...auth }),
        )(bodyProp);

  return { authGet, authPost, authPut, authDelete };
};
