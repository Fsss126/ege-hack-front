import _, {Dictionary, List, LoDashStatic, NumericDictionary} from 'lodash';

export interface InsertAfterEach<T> {
  (array: T[], insertedItem: T): T[];
}
function insertAfterEach<T>(
  this: LoDashStatic,
  array: T[],
  insertedItem: T,
): T[] {
  return this.reduce(
    array,
    (result: T[], value, i, array) => {
      result.push(value);
      if (i < array.length - 1) {
        result.push(insertedItem);
      }
      return result;
    },
    [],
  );
}

const includesValue = _.includes;

export interface Includes<T> {
  (
    collection:
      | List<T>
      | Dictionary<T>
      | NumericDictionary<T>
      | null
      | undefined,
    target: T,
    fromIndex?: number,
  ): boolean;
  (collection: List<T>, subset: List<T>): boolean;
}

function includes<T>(
  collection: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined,
  target: T,
  fromIndex?: number,
): boolean;
function includes<T>(collection: List<T>, subset: List<T>): boolean;
function includes<T>(
  superset: List<T> | Dictionary<T> | NumericDictionary<T> | null | undefined,
  value: T | List<T>,
  fromIndex?: number,
): boolean {
  return value instanceof Array && superset instanceof Array
    ? _.difference(value, superset).length === 0
    : includesValue(superset, value, fromIndex);
}

_.mixin({insertAfterEach, includes});
