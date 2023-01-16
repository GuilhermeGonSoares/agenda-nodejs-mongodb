const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    res.render('login');
}

exports.register = async (req, res) => {
    try{
        const login = new Login(req.body);
        await login.register();

        if(!login.isValid()) {
            req.flash('errors', login.errors);
            req.session.save(() => res.redirect('/login'));
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso!');
        req.session.save(() => res.redirect('/login'));
        return;

    } catch (e) {
        console.log(e);
        return res.render('404');
    } 
};

exports.login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.logar();

        if(!login.isValid()) {
            req.flash('errors', login.errors);
            req.session.save(() => res.redirect('/login'));
            return; 
        }

        req.flash('success', 'Login realizado com sucesso!');
        req.session.user = login.user;
        req.session.save(() => res.redirect('/'));
        return;

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}