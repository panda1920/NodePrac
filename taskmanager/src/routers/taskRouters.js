const express = require('express');
const Task = require('../models/task');
const routerUtils = require('./routerUtils');
const auth = require('../middleware/auth');

let router = express.Router();

// route read requests
router.get('/tasks', auth, async (req, res) => {
    let filter = routerUtils.formFilterFromQuery(req.query, Task);
    let pagination = routerUtils.formPaginationOptions(req.query);
    let sort = routerUtils.formSortOption(req.query, Task);

    try {
        let tasks = await Task.find(
            {owner: req.authenticatedUser._id, ...filter},
            null,
            {
                ...pagination,
                sort: {...sort}
            }
        );
        res.status(200).send(tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:taskId', auth, async (req, res) => {
    let taskId = req.params.taskId;

    try {
        let task = await Task.findOne({_id: taskId, owner: req.authenticatedUser._id});
        if (!task) res.status(404).send();
        else res.status(200).send(task);
    } catch(e) {
        res.status(500).send(e);
    }
});

// route create requests
router.post('/tasks', auth, async (req, res) => {
    let newTask = new Task({
        owner: req.authenticatedUser._id,
        ...req.body
    });
    try {
        await newTask.save();
        res.status(201).send(newTask);
    } catch(e) {
        res.status(400).send(e);
    }
});

// route update requests
router.patch('/tasks/:id', auth, async (req, res) => {
    let update = req.body;
    if (!routerUtils.isUpdateValid(update, Task))
        return res.status(400).send("Invalid update");

    let taskId = req.params.id;
    try {
        let task = await Task.findOne({_id: taskId, owner: req.authenticatedUser._id});
        if (!task) {
            return res.status(404).send("Task not found");
        }

        Object.keys(update).forEach((updateField) => {
            task[updateField] = update[updateField];
        });
        await task.save();
        
        return res.status(200).send(task);

    } catch(e) {
        res.status(500).send(e);
    }
});

// route delete requests
router.delete('/tasks/:id', auth, async (req, res) => {
    let taskId = req.params.id;

    try {
        let deleteResult = await Task.deleteOne({_id: taskId, owner: req.authenticatedUser._id});
        if (deleteResult.deletedCount === 0) 
            res.status(404).send();
        else 
            res.status(200).send(deleteResult);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;