class Login {
    constructor(block) {
        this.appBlock = block;
    }

    autorization() {
        const block = this.appBlock;
        const form = document.createElement('form');
        form.classList.add('action__form');
        const login = document.createElement('div');
        login.classList.add('action__title');
        login.textContent = 'Login';

        const userNameLogin = document.createElement('div');
        userNameLogin.classList.add('action__subtitle');
        userNameLogin.textContent = 'UserName';

        const passwordLogin = document.createElement('div');
        passwordLogin.classList.add('action__subtitle');
        passwordLogin.textContent = 'Password';

        const loginInput = document.createElement('input');
        loginInput.classList.add('action__input');

        const loginPass = document.createElement('input');
        loginPass.classList.add('action__input');


        const loginButton = document.createElement('button');
        loginButton.type = 'button';
        loginButton.textContent = 'Login';
        loginButton.classList.add('action__button');
        loginButton.onclick = () => {
            console.log('login', loginInput.value);
            console.log('password', loginPass.value);
        }

        const loginItem = document.createElement('div');
        loginItem.classList.add('action__item');
        loginItem.classList.add('action__login');


        loginItem.append(login, userNameLogin, loginInput, passwordLogin, loginPass, loginButton);
        form.append(loginItem);
        block.append(form);
    }

    registration() {
        const block = this.appBlock;
        const form = document.createElement('form');
        form.classList.add('action__form');

        const register = document.createElement('div');
        register.classList.add('action__title');
        register.textContent = 'Register';

        const userNameAutor = document.createElement('div');
        userNameAutor.classList.add('action__subtitle');
        userNameAutor.textContent = 'UserName';

        const passwordAutor = document.createElement('div');
        passwordAutor.classList.add('action__subtitle');
        passwordAutor.textContent = 'Password';

        const confirmPassword = document.createElement('div');
        confirmPassword.classList.add('action__subtitle');
        confirmPassword.textContent = 'Confirm Password';

        const autorInput = document.createElement('input');
        autorInput.classList.add('action__input');

        const autorPass = document.createElement('input');
        autorPass.classList.add('action__input');

        const autorPassRepit = document.createElement('input');
        autorPassRepit.classList.add('action__input');

        const autorButton = document.createElement('button');
        autorButton.classList.add('action__button');
        autorButton.type = 'button';
        autorButton.textContent = 'Register';
        autorButton.onclick = () => {
            if (autorPass.value !== autorPassRepit.value) {
                alert('WRONG!!');
            }
            console.log('login', autorInput.value);
            console.log('password', autorPass.value);
            console.log('passwordRepit', autorPassRepit.value);
        }

        const autorItem = document.createElement('div');
        autorItem.classList.add('action__item');
        autorItem.classList.add('action__register')

        autorItem.append(register, userNameAutor, autorInput, passwordAutor, autorPass, confirmPassword, autorPassRepit, autorButton);

        form.append(autorItem);
        block.append(form);
    }
}

export default Login;
