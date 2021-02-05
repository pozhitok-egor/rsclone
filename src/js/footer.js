import axios from "axios";
import Swal from "sweetalert2";
/* eslint-disable */
import Login from "./authorization";
/* eslint-enable */

import loading from "./loading";

// login.autorization();

class Footer {
    constructor(block) {
        this.appBlock = block;
        this.autorLink = [['./icon/github.svg', 'pozhitok-egor', 'https://github.com/pozhitok-egor'], ['./icon/github.svg', 'SNAKE0904', 'https://github.com/SNAKE0904'], ['./icon/in.svg', 'Egor Pozhitok', 'https://www.linkedin.com/in/egor-pozhitok-3906571b7']];
        this.languageType = ['Русский', 'English'];
        this.languageSend = [['Русский', 'ru'], ['English', 'en']];
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
        this.rusLang = ['Не вошли в систему', 'Выйти', 'Войти', 'Регистрация', 'Настройки:', 'Язык:', 'Тема:', 'Валюта:', 'Сделано:'];
        this.engLang = ['Not Signed In', 'Sign Out', 'Sign In', 'Sign Up', 'Settings:', 'Language:', 'Color:', 'Currency:', 'Made by:'];
        this.lenguageSend = [['Русский', 'ru'], ['English', 'en']];
    }

    generateTitle(typeOperation = false, response = '') {
        const login = new Login(document.querySelector(".action"));
        const createList = (typeSelect, block, type, name) => {
            const types = typeSelect;
            const select = block;
            const option = document.createElement('div');
            option.classList.add('action__list_option');
            option.append(name);

            option.onclick = () => {
                types.textContent = '';
                types.textContent = `${type}: ${name}`;
                let langToSend;
                let sumToSend;
                let curToSend;
                if (type === 'Language' || type === 'Язык') {
                    this.languageSend.forEach(value => {
                        if (value[0] === name) {
                            [, langToSend] = value;
                            sumToSend = localStorage.getItem('sum');
                            curToSend = localStorage.getItem('cur');
                        }
                    })
                } else {
                    this.currencyList.forEach(value => {
                        if (value === name) {
                            langToSend = localStorage.getItem('lang');
                            sumToSend = localStorage.getItem('sum');
                            curToSend = value;
                        }
                    })
                }
                loading(document.querySelector('body'));
                axios.put(`https://croesus-backend.herokuapp.com/users`, {
                        language: `${langToSend}`,
                        currency: `${curToSend}`,
                        totalSum: `${sumToSend}`,
                    },
                    {
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    .then(() => {
                        axios.get(`https://croesus-backend.herokuapp.com/users`, {
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                            .then((responsess) => {
                                localStorage.setItem('lang', `${responsess.data.user.settings.language}`);
                                localStorage.setItem('cur', `${responsess.data.user.settings.currency}`);
                                document.querySelector('.menu').childNodes.forEach(value => {
                                    if (value.classList.contains('clicked')) {
                                        value.click();
                                        this.generateTitle(typeOperation, responsess);
                                        loading(document.querySelector('body'), false);
                                    }
                                })
                            })
                            .catch(function (error) {
                                loading(document.querySelector('body'), false);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: `${error.response.data.message}`
                                })
                            })
                    })
                    .catch(function (error) {
                        loading(document.querySelector('body'), false);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${error.response.data.message}`
                        })
                    })
            }
            select.append(option);
        }

        let curencyValue;
        let languageType = 'English';

        this.appBlock.textContent = '';

        function creatorItem(block, data) {
            const itemBlock = document.createElement('a');
            itemBlock.href = `${data[2]}`;
            itemBlock.classList.add('footer__autor-data');
            const icon = document.createElement('img');
            const src = data[0];
            const nameText = data[1];
            icon.src = src;
            icon.alt = '';
            const name = document.createElement('span');
            name.textContent = `${nameText}`;
            itemBlock.append(icon, name);
            block.append(itemBlock);
        }

        const title = document.createElement('div');
        title.classList.add('footer__title');
        title.textContent = 'Croesus';

        const account = document.createElement('div');
        account.classList.add('footer__account');
        const accountName = document.createElement('div');
        const signBlock = document.createElement('div');
        signBlock.classList.add('footer__sign-block');
        const signIn = document.createElement('button');
        signIn.classList.add('footer__sign');
        const signUp = document.createElement('button');
        signUp.classList.add('footer__sign');
        const signOut = document.createElement('button');
        signOut.classList.add('footer__sign');


        if (typeOperation) {
            curencyValue = response.data.user.settings.currency;
            this.languageSend.forEach(value => {
                if (response.data.user.settings.language === value[1]) {
                    languageType = value;
                }
            })
            signOut.onclick = () => {
                localStorage.removeItem('token');
                login.autorization();
                this.generateTitle();
            }
            console.log(response.data.user.username)
            signBlock.append(signOut);
        } else {
            signIn.onclick = () => {
                localStorage.removeItem('token');
                login.autorization();
                this.generateTitle();
            }
            signUp.onclick = () => {
                localStorage.removeItem('token');
                login.registration();
                this.generateTitle();
            }
            signBlock.append(signIn, signUp);
        }
        account.append(accountName, signBlock);

        const settings = document.createElement('div');
        settings.classList.add('footer__settings');
        const settingsTitle = document.createElement('div');

        const languageBlock = document.createElement('div');
        languageBlock.classList.add('footer__settings-item');

        const language = document.createElement('div');

        languageBlock.append(language);

        if (localStorage.getItem('color') === null) {
            localStorage.setItem('color', 'dark');
        }

        const color = document.createElement('div');
        color.classList.add('footer__settings-item');
        if (localStorage.getItem('color') === 'dark') {
            color.classList.add('footer__dark-color');
            document.querySelector('body').classList.add('dark');
        } else if (localStorage.getItem('color') === 'light') {
            color.classList.add('footer__light-color');
            document.querySelector('body').classList.add('light');
        }
        color.onclick = () => {
            if (color.classList.contains('footer__dark-color')) {
                color.classList.remove('footer__dark-color')
                color.classList.add('footer__light-color');
                localStorage.setItem('color', 'light');
                if (document.querySelector('body').classList.contains('dark')) {
                    document.querySelector('body').classList.remove('dark');
                }
                document.querySelector('body').classList.add('light');
            } else if (color.classList.contains('footer__light-color')) {
                color.classList.remove('footer__light-color')
                color.classList.add('footer__dark-color');
                localStorage.setItem('color', 'dark');
                if (document.querySelector('body').classList.contains('light')) {
                    document.querySelector('body').classList.remove('light');
                }
                document.querySelector('body').classList.add('dark');
            }
        }


        const currencyBlock = document.createElement('div');
        currencyBlock.classList.add('footer__settings-item');

        const currency = document.createElement('div');

        currencyBlock.append(currency);

        if (typeOperation) {
            language.onclick = () => {
                const languageSelectList = document.createElement('div');
                languageSelectList.classList.add('action__settings-account');
                languageSelectList.classList.add('action__list');
                languageSelectList.classList.add('footer__list');
                languageSelectList.classList.add('slide-up');
                for (let x = 0; x < this.languageType.length; x += 1) {
                    this.lenguageSend.forEach(value => {
                        if (value[1] === localStorage.getItem('lang')) {
                            if (value[0] === 'Русский') {
                                createList(language, languageSelectList, 'Язык', this.languageType[x]);
                            } else if (value[0] === 'English') {
                                createList(language, languageSelectList, 'Language', this.languageType[x]);
                            }
                        }
                    })
                }
                languageBlock.append(languageSelectList);
                language.style.pointerEvents = 'none';
                setTimeout(() => {
                    const listener = (e) => {
                        if (e.target.classList[0] !== 'action__list_option') {
                            window.removeEventListener('click', listener);
                            languageSelectList.remove();
                            language.style.pointerEvents = 'auto';
                        }
                    }
                    window.addEventListener('click', listener);
                })
            }

            currency.onclick = () => {
                const currencySelectList = document.createElement('div');
                currencySelectList.classList.add('action__settings-account');
                currencySelectList.classList.add('action__list');
                currencySelectList.classList.add('footer__list');
                currencySelectList.classList.add('slide-up');
                for (let x = 0; x < this.currencyList.length; x += 1) {
                    this.lenguageSend.forEach(value => {
                        if (value[1] === localStorage.getItem('lang')) {
                            if (value[0] === 'Русский') {
                                createList(currency, currencySelectList, 'Валюта', this.currencyList[x]);
                            } else if (value[0] === 'English') {
                                createList(currency, currencySelectList, 'Currency', this.currencyList[x]);
                            }
                        }
                    })
                }
                currencyBlock.append(currencySelectList);
                currency.style.pointerEvents = 'none';
                setTimeout(() => {
                    const listener = (e) => {
                        if (e.target.classList[0] !== 'action__list_option') {
                            window.removeEventListener('click', listener);
                            currencySelectList.remove();
                            currency.style.pointerEvents = 'auto';
                        }
                    }
                    window.addEventListener('click', listener);
                })
            }
        }

        settings.append(settingsTitle, languageBlock, color, currencyBlock);

        const autor = document.createElement('div');
        autor.classList.add('footer__autors');
        const autorTitle = document.createElement('div');
        autor.append(autorTitle);
        this.autorLink.forEach(value => {
            creatorItem(autor, value);
        })

        const course = document.createElement('img');
        course.src = './icon/rs.svg';
        course.alt = '';

        this.lenguageSend.forEach(value => {
            if (value[1] === localStorage.getItem('lang')) {
                if (value[0] === 'Русский') {
                    if (typeOperation) {
                        accountName.textContent = `${response.data.user.username}`;
                    } else {
                        accountName.textContent = `${this.rusLang[0]}`;
                    }
                    signOut.textContent = `${this.rusLang[1]}`;
                    signIn.textContent = `${this.rusLang[2]}`;
                    signUp.textContent = `${this.rusLang[3]}`;
                    settingsTitle.textContent = `${this.rusLang[4]}`;
                    language.textContent = `${this.rusLang[5]} ${languageType[0]}`;
                    color.textContent = `${this.rusLang[6]}`;
                    currency.textContent = `${this.rusLang[7]} ${curencyValue}`;
                    autorTitle.textContent = `${this.rusLang[8]}`;
                } else if (value[0] === 'English') {
                    if (typeOperation) {
                        accountName.textContent = `${response.data.user.username}`;
                    } else {
                        accountName.textContent = `${this.engLang[0]}`;
                    }
                    signOut.textContent = `${this.engLang[1]}`;
                    signIn.textContent = `${this.engLang[2]}`;
                    signUp.textContent = `${this.engLang[3]}`;
                    settingsTitle.textContent = `${this.engLang[4]}`;
                    language.textContent = `${this.engLang[5]} ${languageType[0]}`;
                    color.textContent = `${this.engLang[6]}`;
                    currency.textContent = `${this.engLang[7]} ${curencyValue}`;
                    autorTitle.textContent = `${this.engLang[8]}`;
                }
            }
        })

        if (typeOperation) {
            this.appBlock.append(title, account, settings, autor, course);
        } else {
            this.appBlock.append(title, account, autor, course);
        }
    }
}

export default Footer;