const express = require('express');
const User = require('../models/user');
const routerUtils = require('./routerUtils');
const auth = require('../middleware/auth');

let router = express.Router();

// route read requests
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.authenticatedUser);
});

// route create requests
router.post('/users', async (req, res) => {
    let newUser = new User(req.body);
    try {
        await newUser.save();
        let token = newUser.createAuthToken();
        await newUser.saveToken(token);
        res.status(201).send({newUser, token});
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// route update requests
router.patch('/users/me', auth, async (req, res) => {
    let update = req.body;
    if (!routerUtils.isUpdateValid(update, User))
        return res.status(400).send("Invalid update");

    try {
        let user = req.authenticatedUser;
        Object.keys(update).forEach((field) => {
            user[field] = update[field];
        })
        await user.save();

        res.status(200).send(user);

    } catch(e) {
        res.status(500).send(e);
    }
});

// route delete requests
router.delete('/users/me', auth, async (req, res) => {
    try {
        let result = await req.authenticatedUser.remove();
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e);
    } 
});

// route login request
router.post('/users/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let user = await User.findByCredentials(email, password);
        let token = user.createAuthToken();
        await user.saveToken(token);
        
        res.status(200).send({user, token});
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});

// route logout requests
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.authenticatedUser.tokens = req.authenticatedUser.tokens.filter((token) => {
            return token.token !== req.authToken;
        })
        await req.authenticatedUser.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send(e.message);
    }
});
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.authenticatedUser.tokens = [];
        await req.authenticatedUser.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;