const modelUtils = require('../models/modelUtils');

// if there is a field in req that is not defined in model schema, returns false
function isUpdateValid(update, model) {
    let updateFields = Object.keys(update);
    return updateFields.every((field) => {
        return modelUtils.getAllFieldsFromModel(model).includes(field);
    });
}

module.exports = {isUpdateValid};