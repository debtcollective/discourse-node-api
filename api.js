const superagent = require('superagent');

const log = req => {
  const { method, url, data, headers } = req.toJSON();
  console.info(method, url);
  if (data) console.info(data);
  if (headers) console.info(JSON.stringify(headers));
};

const noNulls = (exports.noNulls = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
});

const fixArrParam = params =>
  Object.keys(params).reduce(
    (fixed, key) => ({
      ...fixed,
      ...(Array.isArray(params[key])
        ? params[key].reduce((acc, curr) => ({ [`${key}[]`]: curr }))
        : { [key]: params[key] }),
    }),
    {},
  );

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
 */
const fixParams = params => asPropOf => {
  const ps = noNulls(fixArrParam(paramsAsPropOf(params)(asPropOf)));
  if (Object.keys(ps).length) {
    console.info(ps);
  }
  return ps;
};

const pullDeleting = (prop, obj) => {
  const v = obj[prop];
  delete obj[prop];
  return v;
};

const extractBody = req => prop => req.then(({ body }) => (prop ? body[prop] : body));

module.exports = ({ api_key, api_username = 'system', api_url }) => {
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
