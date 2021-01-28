import axios from "axios";

class Account {
    constructor(block) {
        this.appBlock = block;
        this.typeList = [['Cash', './icon/cash.svg'], ['Web', './icon/web.svg'], ['Card', './icon/card.svg']];
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
        this.totalSum = 0;
        this.valueType = 'USD';
        this.accountList = [];
    }

    addAccount(block) {
        for (let x = 0; x < this.accountList.length; x += 1) {
            const account = this.accountList[x];

            const accountName = document.createElement('div');
            accountName.classList.add('action__account-data');

            const nameTitle = document.createElement('div');
            const sumTitle = document.createElement('div');

            const img = document.createElement('img');
            for (let z = 0; z < this.typeList.length; z += 1) {
                if (account[3].toUpperCase() === this.typeList[z][0].toUpperCase()) {
                    img.src = `${this.typeList[z][1]}`;
                }
            }
            img.alt = '';

            const name = document.createElement('span');
            name.textContent = `${account[0]}`
            nameTitle.append(img, name);

            const sum = document.createElement('span');
            sum.textContent = `${account[1]}`;
            const sumType = document.createElement('span');
            sumType.textContent = `${account[2]}`;
            sumTitle.append(sum, sumType);

            accountName.append(nameTitle, sumTitle);
            block.append(accountName);
        }
    }

    createAccount() {
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

        const div = document.createElement('div');
        div.classList.add('action__header');
        const sum = document.createElement('div');
        sum.classList.add('action__total');
        sum.textContent = `${this.totalSum} ${this.valueType}`;
        const save = document.createElement('div');
        save.classList.add('action__save');
        save.textContent = 'Save';
        div.append(sum, save);

        const form = document.createElement('form');
        form.classList.add('action__account-form');

        const titleBlock = document.createElement('div');
        titleBlock.classList.add('action__item-block');
        const title = document.createElement('div');
        title.classList.add('action__title-account');
        title.textContent = 'Title';
        const titleInput = document.createElement('input');
        titleInput.classList.add('action__input-account');
        titleBlock.append(title, titleInput);

        const typeBlock = document.createElement('div');
        typeBlock.classList.add('action__item-block');
        typeBlock.classList.add('action__input-account_select');
        const type = document.createElement('div');
        type.classList.add('action__title-account');
        type.textContent = 'Type';
        const typeInput = document.createElement('div');
        typeInput.classList.add('action__input-account');
        const img = document.createElement('img');
        img.src = `${this.typeList[0][1]}`;
        img.alt = '';
        typeInput.append(img, `${this.typeList[0][0]}`);
        typeInput.onclick = () => {
            const typeSelectList = document.createElement('div');
            typeSelectList.classList.add('action__input-account');
            typeSelectList.classList.add('action__list');
            typeSelectList.classList.add('slide-up');
            for (let x = 0; x < this.typeList.length; x += 1) {
                createList(typeInput, typeSelectList, this.typeList[x][0], this.typeList[x][1]);
            }
            typeBlock.append(typeSelectList);
            typeInput.style.pointerEvents = 'none';
            setTimeout(() => {
                const listener = (e) => {
                    if (e.target.classList[0] !== 'action__list_option') {
                        window.removeEventListener('click', listener);
                        typeSelectList.remove();
                        typeInput.style.pointerEvents = 'auto';
                    }
                }
                window.addEventListener('click', listener);
            })
        }
        typeBlock.append(type, typeInput);

        const currencyBlock = document.createElement('div');
        currencyBlock.classList.add('action__item-block');
        currencyBlock.classList.add('action__input-account_select');
        const currency = document.createElement('div');
        currency.classList.add('action__title-account');
        currency.textContent = 'Currency';
        const currencySelect = document.createElement('div');
        currencySelect.classList.add('action__input-account');
        currencySelect.append(`${this.currencyList[0]}`);
        currencySelect.onclick = () => {
            const currencySelectList = document.createElement('div');
            currencySelectList.classList.add('action__input-account');
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

        const currencyBalanceBlock = document.createElement('div');
        currencyBalanceBlock.classList.add('action__item-block');
        const currencyBalance = document.createElement('div');
        currencyBalance.classList.add('action__title-account');
        currencyBalance.textContent = 'Currency balance';
        const currencyBalanceInput = document.createElement('input');
        currencyBalanceInput.classList.add('action__input-account');
        currencyBalanceInput.value = '0';
        currencyBalanceBlock.append(currencyBalance, currencyBalanceInput);

        const questionBlock = document.createElement('div');
        questionBlock.classList.add('action__question');
        const question = document.createElement('span');
        question.classList.add('action__title-account');
        question.textContent = 'Include in total balance?';
        const flag = document.createElement('input');
        flag.type = 'checkbox';
        questionBlock.append(question, flag);

        form.append(titleBlock, typeBlock, currencyBlock, currencyBalanceBlock, questionBlock);
        save.onclick = () => {
            if (titleInput.value.trim() === '') {
                alert('ПИШИ НАЗВАНИЕ!');
            } else {
                if (currencyBalanceInput.value.trim() === '') {
                    currencyBalanceInput.value = '0';
                }
                this.accountList.push([titleInput.value, currencyBalanceInput.value, currencySelect.textContent, typeInput.textContent.toLowerCase()]);
                axios.post(`https://croesus-backend.herokuapp.com/accounts/`, {
                        name: `${titleInput.value}`,
                        sum: +currencyBalanceInput.value,
                        currency: `${currencySelect.textContent}`,
                        icon: `${typeInput.textContent.toLowerCase()}`,
                        inCount: flag.checked
                    },
                    {
                        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                    })
                    .then(() => {
                        this.generateTitle();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                // , flag.checked
            }
        }
        block.append(div, form);
    }

    generateTitle() {
        this.accountList = [];
        axios.get(`https://croesus-backend.herokuapp.com/accounts/all`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((responses) => {
                console.log(responses)
                Object.keys(responses.data.accounts).forEach(value => {
                    const massData = [];
                    Object.keys(responses.data.accounts[value]).forEach((data, index) => {
                        if (index > 1) {
                            massData.push(responses.data.accounts[value][data]);
                        }
                    });
                    this.accountList.push(massData);
                })
                console.log(this.accountList)
                // this.generateTitle(this.appBlock);

                const block = this.appBlock;
                block.textContent = '';

                axios.get(`https://croesus-backend.herokuapp.com/users`, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                    .then((response) => {
                        this.totalSum = response.data.user.settings.totalSum;
                        this.valueType = response.data.user.settings.currency;

                        const header = document.createElement('div');
                        header.classList.add('action__header');
                        const sum = document.createElement('div');
                        sum.classList.add('action__total');
                        sum.textContent = `${this.totalSum} ${this.valueType}`;
                        header.append(sum);

                        const account = document.createElement('div');
                        account.classList.add('action__account-title');
                        const accountTitle = document.createElement('div');
                        accountTitle.classList.add('action__title');
                        accountTitle.textContent = 'Accounts';
                        const accountAdd = document.createElement('div');
                        accountAdd.classList.add('action__add')
                        accountAdd.onclick = () => {
                            this.createAccount();
                        }

                        const acountList = document.createElement('div');
                        acountList.classList.add('action__account-list')
                        this.addAccount(acountList);

                        account.append(accountTitle, accountAdd);
                        block.append(header, account, acountList);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export default Account;
