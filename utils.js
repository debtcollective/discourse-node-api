/**
 * Prepends asPropOf to all properties of params for form-data. For example,
 * if given `{ foo: 'bar' }` for `params` and `'bang'` for `asPropOf`, it will
 * return `{ 'bang[foo]': 'bar' }`.
 *
 * @param {discourseApi.Params} params The parameters to cast as properties of asPropOf
 * @return {(asPropOf: string) => discourseApi.Params}
 */
exports.paramsAsPropOf = params => asPropOf =>
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
 * This is currently completely broken due to some pretty thoughtless thinking on my own part
 * Fixes array properties for form-data
 * @param {discourseApi.Params} params Params to fix array properties of
 */
exports.fixArrParam = params =>
  Object.keys(params).reduce(
    (fixed, key) => ({
      ...fixed,
      ...(Array.isArray(params[key])
        ? // This next line is garbage & definitely doesn't do anything good
          params[key].reduce((acc, curr) => ({ [`${key}[]`]: curr }), {})
        : { [key]: params[key] }),
    }),
    {},
  );

/**
 * Maps the keys of an object to new keys using the mapKey function
 * @param {(key: string, value: any) => string} mapKey The key mapping function
 * @return {(obj: any) => any} A function accepting the object to map, returning the mapped object
 */
const mapObjKeys = (exports.mapObjKeys = mapKey => obj =>
  Object.keys(obj).reduce(
    (mapped, key) => ({
      ...mapped,
      [mapKey(key, obj[key])]: obj[key],
    }),
    {},
  ));

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
 */
const flattenObj = (exports.flattenObj = obj =>
  Object.keys(obj).reduce(
    (flat, key) => ({
      ...flat,
      ...(typeof obj[key] === 'object' && !Array.isArray(obj[key])
        ? flattenObj(mapObjKeys(innerKey => `${key}[${innerKey}]`)(obj[key]))
        : { [key]: obj[key] }),
    }),
    {},
  ));
