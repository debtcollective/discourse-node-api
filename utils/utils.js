/**
 * Excludes properties of an object if the passed in predicate passes
 * @param {(v: any, k: string|number) => boolean} predicate The predicate with which to test the key value pairs
 * @return {(obj: any) => any} The object excluding values passing the predicate
 */
const excludeBy = predicate => obj =>
  Object.keys(obj).reduce(
    (acc, k) => ({
      ...acc,
      ...(predicate(obj[k], k) ? {} : { [k]: obj[k] }),
    }),
    {},
  );

/**
 * Prepends asPropOf to all properties of params for form-data. For example,
 * if given `{ foo: 'bar' }` for `params` and `'bang'` for `asPropOf`, it will
 * return `{ 'bang[foo]': 'bar' }`.
 *
 * @param {Params} params The parameters to cast as properties of asPropOf
 * @return {(asPropOf: string) => Params}
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

/**
 * Maps the keys of an object to new keys using the mapKey function
 * @param {(key: string, value: any) => string} mapKey The key mapping function
 * @return {(obj: any) => any} A function accepting the object to map, returning the mapped object
 */
const mapObjKeys = mapKey => obj =>
  Object.keys(obj).reduce(
    (mapped, key) => ({
      ...mapped,
      [mapKey(key, obj[key])]: obj[key],
    }),
    {},
  );

/**
 * Flattens an object by mapping any properties that are key -> value objects
 * to form-data compatible fields
 *
 * @example
 *
 * const foo = { bar: { bang: true } };
 * flattenObj(foo) //=> { 'bar[bang]': true };
 *
 * @param {any} obj Object to flatten
 * @type {(obj: any) => any}
 */
const flattenObj = obj =>
  Object.keys(obj).reduce(
    (flat, key) => ({
      ...flat,
      ...(typeof obj[key] === 'object' && !Array.isArray(obj[key])
        ? flattenObj(mapObjKeys(innerKey => `${key}[${innerKey}]`)(obj[key]))
        : { [key]: obj[key] }),
    }),
    {},
  );

/**
 * Splits the properties of an object using the predicate. If the predicate returns true
 * the key -> value pair will be placed in the left result, if false then in the right.
 *
 * @example
 *
 * const foo = {
 *  bar: [],
 *  bang: 10
 * };
 *
 * splitProps(Array.isArray, foo);
 * //=> { left: { bar: [] }, right: { bang: 10 } }
 *
 * @param {(v: any, key: string|number) => boolean} predicate Test to determine which side to split to
 * @param {any} obj Object whose properties should be split
 */
const splitProps = (predicate, obj) =>
  Object.keys(obj).reduce(
    ({ left, right }, key) => ({
      left: predicate(obj[key], key) ? { ...left, [key]: obj[key] } : left,
      right: !predicate(obj[key], key) ? { ...right, [key]: obj[key] } : left,
    }),
    {
      left: {},
      right: {},
    },
  );

/**
 * Returns a function taking a property name to extract from a request
 * @param {Promise<Object>} req The request from which to extract the body property
 * @return {(prop: String) => Promise<any>} The extracted property
 */
const extractBody = req => prop => req.then(({ body }) => (prop ? body[prop] : body));

/**
 * Must always be called after fixArrParam otherwise the typeof x === 'object' will be deceiving
 * @param {discourseApi.Params} params
 * @return {discourseApi.Params} params but without any object properties
 */
const noObjects = excludeBy(v => typeof v === 'object' && !Array.isArray(v));

module.exports = {
  flattenObj,
  mapObjKeys,
  paramsAsPropOf,
  splitProps,
  extractBody,
  excludeBy,
  noObjects,
};
