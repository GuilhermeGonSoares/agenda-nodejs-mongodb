const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscarTodosContatos();
    res.render('index', {
        contatos
    });
};


