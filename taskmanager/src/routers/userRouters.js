const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const routerUtils = require('./routerUtils');
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account');

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
        sendWelcomeEmail(newUser.name, newUser.email);
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
        sendCancellationEmail(req.authenticatedUser.name, req.authenticatedUser.email);
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

// upload avatar images
let upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter: function(req, file, cb) {
        const acceptedExtensions = ['jpg', 'jpeg', 'png'];
        const regexString = `.*\\.(${acceptedExtensions.join('|')})$`;
        const checkFileExtensionRegex = new RegExp(regexString);

        if (checkFileExtensionRegex.test(file.originalname)) {
            return cb(undefined, true); // no error, accept upload
        }

        cb(new Error('Please upload an image'));
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    let normalizedBuffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();    
    req.authenticatedUser.avatar = normalizedBuffer;
    
    try {
        await req.authenticatedUser.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
}, uploadErrorHandler);
function uploadErrorHandler(error, req, res, next) {
    res.status(400).send({error: error.message});
}

// delete avatar image
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.authenticatedUser.avatar = undefined;
        await req.authenticatedUser.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});

// fetching avatar
router.get('/users/:id/avatar', async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await User.findOne({_id: userId});
        if (user && user.avatar) {
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
        }
        else
            throw new Error();
    }
    catch (e) {
        res.status(404).send();
    }
});

module.exports = router;