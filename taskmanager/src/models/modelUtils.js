function getAllFieldsFromModel(model) {
    let fields = Object.keys(model.schema.obj);
    return model.schema.options.timestamps ? fields.concat(['createdAt', 'updatedAt']) : fields;
}

function doesFieldExistInModel(fields, model) {
    return fields.every((field) => {
        return getAllFieldsFromModel(model).includes(field);
    });
}

function filterExistingFieldsInModel(fields, model) {
    return fields.filter((field) => {
        return getAllFieldsFromModel(model).includes(field);
    });
}

module.exports = {getAllFieldsFromModel, doesFieldExistInModel, filterExistingFieldsInModel};