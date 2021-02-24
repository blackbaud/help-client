export interface ObjectCompareOptions {
  includes?: string[];
  excludes?: string[];
}

// Neither object or Object types are used here since they don't allow index access.
export interface ObjectDictionary {
  [k: string]: unknown;
}

/**
 * Basic set difference since it doesn't exist on Set directly.
 * @return a set containing elements in a but not in b
 */
function difference<T>(a: Set<T>, b: Set<T>) {
  const diff: Set<T> = new Set(a);
  b.forEach((v: T) => diff.delete(v));
  return diff;
}

/**
 * TODO: make a more robust version that accounts for arrays that have same values but in different order.
 * @return whether or not the two arrays contain the same values in each index
 */
function areEqualArrays(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}

export const OBJECT_COMPARE_MATCHERS: jasmine.CustomMatcherFactories = {
  toEqualObject(util: jasmine.MatchersUtil, customEqualityTesters: jasmine.CustomEqualityTester[])
    : jasmine.CustomMatcher {
    return {
      compare(actual: ObjectDictionary, expected: ObjectDictionary, options?: ObjectCompareOptions)
        : jasmine.CustomMatcherResult {
        const opts: ObjectCompareOptions = Object.assign({ includes: [], excludes: [] }, options);
        const actualProps: string[] = Object.keys(actual);
        const startingListOfProps = (opts.includes.length > 0) ? opts.includes : actualProps;
        const relevantProps: Set<string> = new Set(startingListOfProps
          .filter(p => !opts.excludes.includes(p))
        );

        const missingProps = difference(relevantProps, new Set(actualProps));
        if (missingProps.size > 0) {
          return { message: `Expected props "${Array.from(missingProps).join(', ')}" to exist`, pass: false };
        }

        const propsWithIncorrectValues: string[] = [];
        relevantProps.forEach((prop: string) => {
          const actualVal = actual[prop];
          const expectedVal = expected[prop];
          if (Array.isArray(actualVal) && Array.isArray(expectedVal)) {
            if (!areEqualArrays(actualVal, expectedVal)) {
              propsWithIncorrectValues.push(prop);
            }
          } else if (actualVal !== expectedVal) {
            propsWithIncorrectValues.push(prop);
          }
        });

        const incorrectPropMessages = propsWithIncorrectValues
          .map(key => `${key}: expected ${expected[key]}; actual ${actual[key]}`);

        const containsIncorrectValues = propsWithIncorrectValues.length > 0;
        const message = containsIncorrectValues
          ? `Object contains unexpected values\n\t${incorrectPropMessages.join('\n\t')}`
          : `Object does not contain unexpected values`;

        return { pass: !containsIncorrectValues, message: message };
      }
    };
  }
};
