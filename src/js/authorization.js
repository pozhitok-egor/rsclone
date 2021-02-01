import axios from 'axios';
import Account from './account'

const account = new Account(document.querySelector(".action"));

class Login {
    constructor(block) {
        this.appBlock = block;
        this.currencyList = [
            "CAD",
            "HKD",
            "ISK",
            "PHP",
            "DKK",
            "HUF",
            "CZK",
            "GBP",
            "RON",
            "SEK",
            "IDR",
            "INR",
            "BRL",
            "RUB",
            "HRK",
            "JPY",
            "THB",
            "CHF",
            "EUR",
            "MYR",
            "BGN",
            "TRY",
            "CNY",
            "NOK",
            "NZD",
            "ZAR",
            "USD",
            "MXN",
            "SGD",
            "AUD",
            "ILS",
            "KRW",
            "PLN"
        ];
        this.languageType = ['Русский', 'English'];
        this.lenguageSend = [['Русский', 'ru'], ['English', 'en']];
    }

    autorization() {
        const block = this.appBlock;
        block.textContent = '';
        const form = document.createElement('form');
        form.classList.add('action__form');
        const login = document.createElement('div');
        login.classList.add('action__autorization-title');
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

        const dataBlock = document.createElement('div');
        dataBlock.classList.add('action__autorization-data');
        dataBlock.append(userNameLogin, loginInput, passwordLogin, loginPass);


        const loginButton = document.createElement('button');
        loginButton.type = 'button';
        loginButton.textContent = 'Login';
        loginButton.classList.add('action__button');
        loginButton.onclick = () => {
            axios.post(`https://croesus-backend.herokuapp.com/users/login`, {
                username: `${loginInput.value}`,
                password: `${loginPass.value}`
            })
                .then(function (response) {
                    localStorage.setItem('token', response.data.token);
                    axios.get(`https://croesus-backend.herokuapp.com/users`, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                        .then(function () {
                            account.generateTitle();
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                })
                .catch(function (error) {
                    console.log(error);
                });
            // console.log('login', loginInput.value);
            // console.log('password', loginPass.value);


        }

        const loginItem = document.createElement('div');
        loginItem.classList.add('action__item');
        loginItem.classList.add('action__login');


        loginItem.append(login, dataBlock, loginButton);
        form.append(loginItem);
        block.append(form);
    }

    registration() {
        function createList(typeSelect, block, name, icon = false) {
            const types = typeSelect;
            const select = block;
            const option = document.createElement('div');
            option.classList.add('action__list_option');
            if (icon) {
                const img = document.createElement('img');
                img.src = `${icon}`;
                img.alt = '';
                option.append(img, name);
            } else {
                option.append(name);
            }

            option.onclick = () => {
                types.textContent = '';
                if (icon) {
                    const img = document.createElement('img');
                    img.src = `${icon}`;
                    img.alt = '';
                    types.append(img, name);
                } else {
                    types.append(name);
                }
                block.remove();
                types.style.pointerEvents = 'auto';
            }


            select.append(option);
        }

        const block = this.appBlock;
        block.textContent = '';
        const form = document.createElement('form');
        form.classList.add('action__form');

        const register = document.createElement('div');
        register.classList.add('action__autorization-title');
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

        const language = document.createElement('div');
        language.classList.add('action__subtitle');
        language.textContent = 'Language';

        const currency = document.createElement('div');
        currency.classList.add('action__subtitle');
        currency.textContent = 'Currency';


        const autorInput = document.createElement('input');
        autorInput.classList.add('action__input');

        const autorPass = document.createElement('input');
        autorPass.classList.add('action__input');

        const autorPassRepit = document.createElement('input');
        autorPassRepit.classList.add('action__input');

        const languageBlock = document.createElement('div');
        languageBlock.classList.add('action__settings-block');
        languageBlock.classList.add('action__input-account_select');
        const languageSelect = document.createElement('div');
        languageSelect.classList.add('action__settings-account');
        languageSelect.append(`${this.languageType[0]}`);
        languageSelect.onclick = () => {
            const languageSelectList = document.createElement('div');
            languageSelectList.classList.add('action__settings-account');
            languageSelectList.classList.add('action__list');
            languageSelectList.classList.add('slide-up');
            for (let x = 0; x < this.languageType.length; x += 1) {
                createList(languageSelect, languageSelectList, this.languageType[x]);
            }
            languageBlock.append(languageSelectList);
            languageSelect.style.pointerEvents = 'none';
            setTimeout(() => {
                const listener = (e) => {
                    if (e.target.classList[0] !== 'action__list_option') {
                        window.removeEventListener('click', listener);
                        languageSelectList.remove();
                        languageSelect.style.pointerEvents = 'auto';
                    }
                }
                window.addEventListener('click', listener);
            })
        }
        languageBlock.append(language, languageSelect);

        const currencyBlock = document.createElement('div');
        currencyBlock.classList.add('action__settings-block');
        currencyBlock.classList.add('action__input-account_select');
        const currencySelect = document.createElement('div');
        currencySelect.classList.add('action__settings-account');
        currencySelect.append(`${this.currencyList[0]}`);
        currencySelect.onclick = () => {
            const currencySelectList = document.createElement('div');
            currencySelectList.classList.add('action__settings-account');
            currencySelectList.classList.add('action__list');
            currencySelectList.classList.add('slide-up');
            for (let x = 0; x < this.currencyList.length; x += 1) {
                createList(currencySelect, currencySelectList, this.currencyList[x]);
            }
            currencyBlock.append(currencySelectList);
            currencySelect.style.pointerEvents = 'none';
            setTimeout(() => {
                const listener = (e) => {
                    if (e.target.classList[0] !== 'action__list_option') {
                        window.removeEventListener('click', listener);
                        currencySelectList.remove();
                        currencySelect.style.pointerEvents = 'auto';
                    }
                }
                window.addEventListener('click', listener);
            })
        }
        currencyBlock.append(currency, currencySelect);

        const autorButton = document.createElement('button');
        autorButton.classList.add('action__button');
        autorButton.type = 'button';
        autorButton.textContent = 'Register';
        autorButton.onclick = () => {
            if (autorInput.value === '' || autorPass.value === '' || autorPassRepit.value === '') {
                alert('Не всё заполнено!')
            } else if (autorPass.value !== autorPassRepit.value) {
                alert('WRONG!!');
            } else {
                console.log(autorInput.value);
                console.log(autorPass.value);
                console.log(autorPassRepit.value);
                let lang;
                this.lenguageSend.forEach(value => {
                    if (languageSelect.textContent === value[0]) {
                        lang = value;
                    }
                })
                axios.post(`https://croesus-backend.herokuapp.com/users/register`, {
                    username: `${autorInput.value}`,
                    password: `${autorPass.value}`,
                    language: `${lang[1]}`,
                    currency: `${currencySelect.textContent}`
                })
                    .then(function (response) {
                        localStorage.setItem('token', response.data.token);
                        axios.get(`https://croesus-backend.herokuapp.com/users`, {
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                            .then(function () {
                                account.generateTitle();
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }


        const data = document.createElement('div');
        data.classList.add('action__settings-reg');
        data.append(userNameAutor, autorInput, passwordAutor, autorPass, confirmPassword, autorPassRepit);

        const settings = document.createElement('div');
        settings.classList.add('action__settings-data');
        settings.append(languageBlock, currencyBlock);

        const autorItem = document.createElement('div');
        autorItem.classList.add('action__item');
        autorItem.classList.add('action__register')

        const item = document.createElement('div');
        item.classList.add('action__settings-items');
        item.append(data, settings);

        autorItem.append(register, item, autorButton);

        form.append(autorItem);
        block.append(form);
    }
}

export default Login;
