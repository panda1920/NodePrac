const modelUtils = require('../models/modelUtils');

// if there is a field in req that is not defined in model schema, returns false
function isUpdateValid(update, model) {
    let updateFields = Object.keys(update);
    return modelUtils.doesFieldExistInModel(updateFields, model);
}

// interprets query and check its validity
function formFilterFromQuery(query, model) {
    let fields = Object.keys(query);
    let validFields = modelUtils.filterExistingFieldsInModel(fields, model);
    let filter = sanitizeFilterValues( filterObjectForFields(query, validFields) );

    return filter;
}
function filterObjectForFields(object, fields) {
    let newobject = {};
    fields.forEach(field => { newobject[field] = object[field]; });
    return newobject;
}
function sanitizeFilterValues(filter) {
    if (filter.completed === 'true') 
        filter.completed = true;
    else if (filter.completed === 'false')
        filter.completed = false;

    return filter;
}

// interprets query for pagination options
function formPaginationOptions(query) {
    return {
        limit: parseInt(query.limit),
        skip: parseInt(query.skip)
    };
}

function formSortOption(query, model) {
    if (query.sortBy === null)
        return {};

    let {0: fieldToSort, 1: order} = query.sortBy.split('_');

    let sortOption = {};
    if (!modelUtils.doesFieldExistInModel([fieldToSort], model))
        return sortOption;
    
    if (order === 'asc')
        sortOption[fieldToSort] = 1
    else if (order === 'desc')
        sortOption[fieldToSort] = -1;

    return sortOption;
}

module.exports = {isUpdateValid, formFilterFromQuery, formPaginationOptions, formSortOption};