const mongoose = require('mongoose');
const validator = require('validator');

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

    async register() {
        this.validate();
        if(this.errors.length > 0) return;
        
        try{
            this.user = await LoginModel.create(this.body);
        } catch (e) {
            console.log(e);
        }
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