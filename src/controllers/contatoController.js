const Contato = require('../models/ContatoModel');


exports.index = (req, res) => {
    return res.render('contato', {
        contato: {}
    });
};

exports.editIndex = async (req, res) => {
    const id = req.params.id;
    if(!id) return res.render('404');
    try {
        const contato = await Contato.buscaPorId(id);
        if (!contato) return res.render('404');

        res.render('contato',{ contato });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.register = async (req, res) => {
    try{
        const contato = new Contato(req.body);
        await contato.register();
        
        if (contato.errors.length > 0 ) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return
        }

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;

    } catch (e) {
        console.log(e);
        res.render('404');
    }
};