const { expect } = require('chai');

const { paramsAsPropOf, mapObjKeys, flattenObj, splitProps } = require('../utils/utils');
const { Req } = require('./fixtures');

describe('utils', () => {
  describe('paramsAsPropOf', () => {
    it('should map the properties of the object to properties of the key', () => {
      const obj = { a: 1, b: 2 };
      expect(paramsAsPropOf(obj)('fooBar')).eql({
        'fooBar[a]': 1,
        'fooBar[b]': 2,
      });
    });

    it('should treat the passed in object as immutable', () => {
      const obj = { a: 1, b: 2 };
      paramsAsPropOf(obj)('fooBar');
      expect(obj.a).exist;
      expect(obj['fooBar[a]']).not.exist;
    });
  });

  describe('mapObjKeys', () => {
    it('should map all the properties of the object using the mapKey fn', () => {
      const obj = { a: 1, b: 2 };
      expect(mapObjKeys((k, v) => k + v)(obj)).eql({
        a1: 1,
        b2: 2,
      });
    });

    it('should not mutate the passed in object', () => {
      const obj = { a: 1, b: 2 };
      mapObjKeys((k, v) => k + v)(obj);

      expect(obj.a).exist;
      expect(obj.a1).not.exist;
    });
  });

  describe('flattenObj', () => {
    it('should flatten the object into a form-data usable format', () => {
      const obj = { bar: { bang: 2 } };
      expect(flattenObj(obj)).eql({ 'bar[bang]': 2 });
    });

    it('should recursively flatten the object', () => {
      const obj = { bar: { bang: { foo: 2 } } };
      expect(flattenObj(obj)).eql({
        'bar[bang][foo]': 2,
      });
    });

    it('should not mutate the passed in object', () => {
      const obj = { bar: { bang: 2 } };
      flattenObj(obj);

      expect(obj.bar).eql({ bang: 2 });
      expect(obj['bar[bang]']).not.exist;
    });
  });

  describe('splitProps', () => {
    it('should split the properties using the predicate', () => {
      const obj = { bar: [], bang: 10 };
      expect(splitProps(Array.isArray, obj)).eql({
        left: { bar: [] },
        right: { bang: 10 },
      });
    });

    it('should not mutate the passed in object', () => {
      const obj = { bar: [], bang: 10 };
      splitProps(Array.isArray, obj);

      expect(obj.bar).eql([]);
      expect(obj.bang).eql(10);
      expect(obj.left).not.exist;
    });
  });
});
