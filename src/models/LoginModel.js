const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type:String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async logar() {
        await this.validate();
        if (this.errors.length > 0) return;
        
        this.user = await LoginModel.findOne({email:this.body.email});
        if (!this.user) {
            this.errors.push('E-mail não cadastrado!');
            return;
        }
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida!');
            return;
        }

    }

    async register() {
        this.validate();
        await this.userExists();
        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        //Verificar se o e-mail já foi cadastrado!
        const user = await LoginModel.findOne({email:this.body.email});
        if (user) this.errors.push('E-mail já cadastrado!');
    }

    validate() {
        this.cleanUp();
        //Validação!
        //O e-mail precisa ser válido
        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
        //A senha precisa ter entre 3 e 50 
        if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres!')
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password,
        }
    }

    isValid() {
        return this.errors.length === 0;
    }
}

module.exports = Login;


