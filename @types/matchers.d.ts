import { ObjectCompareOptions, ObjectDictionary } from '../src/mocks/object.compare.matcher';

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toEqualObject(
        expected: Expected<Object>,
        opts?: ObjectCompareOptions)
        : boolean;
    }
  }
}
