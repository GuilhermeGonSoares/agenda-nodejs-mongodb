const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criandoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    async register() {
        this.validate();
        if (this.errors.length > 0 ) return;
        this.contato = await ContatoModel.create(this.body);
    }

    validate() {
        this.cleanUp();
        //Validação!
        //O e-mail precisa ser válido
        if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
        if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
        if (!this.body.email && !this.body.telefone) {
            this.errors.push('E-mail e Telefone não podem ser vazios');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            } else {
                this.body[key] = this.body[key].trim();
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        }
    }

    static async buscaPorId(id) {
        if(typeof id !== 'string') return;
        return await ContatoModel.findById(id);
    }
}

module.exports = Contato;