const express = require('express');
const User = require('../models/user');
const routerUtils = require('./routerUtils');

let router = express.Router();

// route read requests
router.get('/users', async (req, res) => {
    try {
        let users = await User.find({});
        res.status(200).send(users);
    }
    catch(e) {
        res.status(500).send(e);
    }
});
router.get('/users/:id', async (req, res) => {
    let userId = req.params.id;

    try {
        let user = await User.findOne({_id: userId});
        if (!user) res.status(404).send();
        else res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});

// route create requests
router.post('/users', async (req, res) => {
    let newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(201).send(newUser);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// route update requests
router.patch('/users/:id', async (req, res) => {
    let update = req.body;
    if (!routerUtils.isUpdateValid(update, User))
        return res.status(400).send("Invalid update");

    let userId = req.params.id;
    try {
        let user = await User.findByIdAndUpdate(userId, update, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send("User not found");
        }
        else
            return res.status(200).send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});

// route delete requests
router.delete('/users/:id', async (req, res) => {
    let userId = req.params.id;

    try {
        let deleteResult = await User.deleteOne({_id: userId});
        if (deleteResult.deletedCount === 0) 
            res.status(404).send();
        else 
            res.status(200).send(deleteResult);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;