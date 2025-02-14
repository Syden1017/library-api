const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    res.json({ message: "Форма входа/регистрации" });
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Не авторизован" });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/user/me',
    failureRedirect: '/api/user/login',
    failureFlash: true
}));

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Пользователь зарегистрирован" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка регистрации" });
    }
});

module.exports = router;
