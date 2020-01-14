import _ from 'lodash';

function insertAfterEach(array, insertedItem) {
    return this.reduce(array, (result, value, i, array) => {
        result.push(value);
        if (i < array.length - 1)
            result.push(insertedItem);
        return result;
    }, []);
}

_.mixin({ insertAfterEach });
