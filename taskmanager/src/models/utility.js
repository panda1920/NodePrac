function getAllFieldsFromModel(model) {
    return Object.keys(model.schema.obj);
}

module.exports = {getAllFieldsFromModel};