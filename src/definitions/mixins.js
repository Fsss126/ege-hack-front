import _ from 'lodash';

function insertAfterEach(array, insertedItem) {
    return this.reduce(array, (result, value, i, array) => {
        result.push(value);
        if (i < array.length - 1)
            result.push(insertedItem);
        return result;
    }, []);
}

const includesValue = _.includes;

function includes(superset, value) {
    return value instanceof Array ? _.difference(value, superset).length === 0 : includesValue(superset, value);
}

_.mixin({ insertAfterEach, includes });
