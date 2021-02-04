import axios from "axios";
import Swal from "sweetalert2";
import loading from "./loading";

class Operation {
    constructor(block) {
        this.appBlock = block;
        this.typeList = [];
        // ['Cash', './icon/cash.svg'], ['Web', './icon/web.svg'], ['Card', './icon/card.svg']
        this.accountsID = '';
        this.operationType = '';
        this.totalSum = 0;
        this.valueType = 'USD';
        this.minusCategory = [['cafe', './icon/food.svg'], ['health', './icon/health.svg'], ['food', './icon/foods.svg'], ['family', './icon/family.svg'], ['rest', './icon/rest.svg'], ['study', './icon/study.svg'], ['gifts', './icon/gifts.svg'], ['shopping', './icon/shopping.svg'], ['home', './icon/home.svg'], ['car', './icon/car.svg'], ['care', './icon/care.svg'], ['other', './icon/other.svg']];
        this.ruMinusCategory = [['Кафе', './icon/food.svg'], ['Здоровье', './icon/health.svg'], ['Еда', './icon/foods.svg'], ['Семья', './icon/family.svg'], ['Отдых', './icon/rest.svg'], ['Обучение', './icon/study.svg'], ['Подарки', './icon/gifts.svg'], ['Шопинг', './icon/shopping.svg'], ['Дом', './icon/home.svg'], ['Авто', './icon/car.svg'], ['Любимые', './icon/care.svg'], ['Другое', './icon/other.svg']];
        this.addCategory = [['salary', './icon/cash.svg'], ['other', './icon/other.svg']];
        this.ruAddCategory = [['З/П', './icon/cash.svg'], ['Другое', './icon/other.svg']];
        this.allCategory = [['cafe', './icon/foods.svg'], ['health', './icon/health.svg'], ['food', './icon/food.svg'], ['family', './icon/family.svg'], ['rest', './icon/rest.svg'], ['study', './icon/study.svg'], ['gifts', './icon/gifts.svg'], ['shopping', './icon/shopping.svg'], ['home', './icon/home.svg'], ['car', './icon/car.svg'], ['care', './icon/care.svg'], ['salary', './icon/cash.svg'], ['other', './icon/other.svg']]
        this.ruAllCategory = [['Кафе', './icon/foods.svg'], ['Здоровье', './icon/health.svg'], ['Еда', './icon/food.svg'], ['Семья', './icon/family.svg'], ['Отдых', './icon/rest.svg'], ['Обучение', './icon/study.svg'], ['Подарки', './icon/gifts.svg'], ['Шопинг', './icon/shopping.svg'], ['Дом', './icon/home.svg'], ['Авто', './icon/car.svg'], ['Любимые', './icon/care.svg'], ['З/П', './icon/cash.svg'], ['Другое', './icon/other.svg']]
        this.daysWeek = [['Day', 'Week', 'Month', 'Year'], ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']];
        this.ruDaysWeek = [['День', 'Неделю', 'Месяц', 'Год'], ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']];
        this.dataOperation = [];
        this.rusLang = ['Сохранить', 'Сумма', 'Повторять транзакцию?', 'Повторять каждые:'];
        this.engLang = ['Save', 'Amount', 'Repeat Transaction?', 'Repeat every:'];
        this.lenguageSend = [['Русский', 'ru'], ['English', 'en']];
    }

    generateTitle() {
        this.dataOperation = [];
        loading(document.querySelector('body'));
        axios.get(`https://croesus-backend.herokuapp.com/transactions/all`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((responses) => {
                Object.keys(responses.data.transactions).forEach(value => {
                    const massData = [];
                    Object.keys(responses.data.transactions[value]).forEach((data, index) => {
                        if (index === 0) {
                            massData.push(responses.data.transactions[value].accountId, responses.data.transactions[value].type, responses.data.transactions[value].sum, responses.data.transactions[value].createdAt, responses.data.transactions[value].income, responses.data.transactions[value][data]);
                        }
                    });
                    this.dataOperation.push(massData);
                })

                const mounth = ["January", "February", "March", "April", "May", "June", "July", "August", "Septeber", "October", "November", "December"];
                const ruMounth = ["Явнварь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
                // addOperation
                const block = this.appBlock;
                block.textContent = '';

                const sort = [];

                for (let x = 0; x < this.dataOperation.length; x += 1) {
                    const mass = []
                    for (let z = x; z < this.dataOperation.length; z += 1) {
                        if (this.dataOperation[x][3].split('T')[0] === this.dataOperation[z][3].split('T')[0]) {
                            mass.push(this.dataOperation[z]);
                        }
                    }
                    sort.push(mass);
                    x = sort.flat(1).length;
                }


                axios.get(`https://croesus-backend.herokuapp.com/users`, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                })
                    .then((response) => {
                        this.valueType = response.data.user.settings.currency;
                        localStorage.setItem('cur', `${response.data.user.settings.currency}`);
                        this.totalSum = response.data.user.settings.totalSum;
                        localStorage.setItem('sum', `${this.totalSum}`);

                        const header = document.createElement('div');
                        header.classList.add('action__header');
                        const sum = document.createElement('div');
                        sum.classList.add('action__total');
                        sum.textContent = `${this.totalSum} ${this.valueType}`;
                        const imgSearch = document.createElement('img');
                        imgSearch.src = './icon/search.svg';
                        imgSearch.alt = '';
                        header.append(sum, imgSearch);
                        block.append(header);

                        sort.forEach(value => {
                            const dayBlock = document.createElement('div');
                            dayBlock.classList.add('action__day-block');
                            const blockTitle = document.createElement('div');
                            blockTitle.classList.add('action__date');
                            const date = value[0][3].split('T')[0].split("-").reverse().join(" ").split(' ');

                            this.lenguageSend.forEach(values => {
                                if (values[1] === localStorage.getItem('lang')) {
                                    if (values[0] === 'Русский') {
                                        blockTitle.textContent = `${date[0]} ${ruMounth[date[1] - 1]} ${date[2]}`;
                                    } else if (values[0] === 'English') {
                                        blockTitle.textContent = `${date[0]} ${mounth[date[1] - 1]} ${date[2]}`;
                                    }
                                }
                            })
                            const operationBlock = document.createElement('div');
                            operationBlock.classList.add('action__operation-list');
                            value.forEach((item) => {
                                const typeItem = item[1];
                                const sumItem = item[2];
                                const incomeItem = item[4];
                                const idTranc = item[5]

                                axios.get(`https://croesus-backend.herokuapp.com/accounts/${item[0]}`, {
                                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                                })
                                    .then((responsess) => {
                                        const div = document.createElement('div');
                                        div.classList.add('action__operation-item');
                                        const typeSection = document.createElement('div');
                                        typeSection.classList.add('action__type-section');
                                        const valuesSection = document.createElement('div');
                                        if (incomeItem) {
                                            valuesSection.classList.add('action__refill');
                                            valuesSection.textContent = `+${sumItem} ${responsess.data.account.currency}`
                                        } else {
                                            valuesSection.classList.add('action__cash-out');
                                            valuesSection.textContent = `-${sumItem} ${responsess.data.account.currency}`
                                        }
                                        const img = document.createElement('img');
                                        for (let z = 0; z < this.allCategory.length; z += 1) {
                                            if (item[1].toUpperCase() === this.allCategory[z][0].toUpperCase()) {
                                                img.src = `${this.allCategory[z][1]}`;
                                            }
                                        }
                                        img.alt = '';
                                        const nameDiv = document.createElement('div');
                                        const type = document.createElement('div');
                                        type.textContent = typeItem[0].toUpperCase() + typeItem.slice(1);
                                        const name = document.createElement('div');
                                        name.textContent = responsess.data.account.name[0].toUpperCase() + responsess.data.account.name.slice(1);
                                        name.classList.add('action__name');
                                        nameDiv.append(type, name);
                                        typeSection.append(img, nameDiv);

                                        div.append(typeSection, valuesSection);
                                        operationBlock.append(div);
                                        div.onclick = () => {
                                            if (incomeItem === true) {
                                                this.createOperation('', true, idTranc);
                                            } else {
                                                this.createOperation('minus', true, idTranc);
                                            }
                                        }
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
                            dayBlock.append(blockTitle, operationBlock);

                            block.append(dayBlock);
                        })
                        const buttonContainer = document.createElement('div');
                        buttonContainer.classList.add('action__add-list');
                        const addOperation = document.createElement('button');
                        addOperation.classList.add('action__add-operation');
                        const addImg = document.createElement('img');
                        addImg.src = './icon/plus.svg';
                        addImg.alt = '';

                        const minusOperation = document.createElement('button');
                        minusOperation.classList.add('action__add-operation');
                        const minusImg = document.createElement('img');
                        minusImg.src = './icon/minus.svg';
                        minusImg.alt = '';

                        addOperation.append(addImg);
                        minusOperation.append(minusImg);
                        buttonContainer.append(addOperation);

                        const options = (buttonBlock, buttonAdd, buttonMinus, type) => {
                            const blocks = buttonBlock;
                            const adds = buttonAdd;
                            const minus = buttonMinus;

                            if (type === 'list') {
                                blocks.classList.add('action__clicked');
                                blocks.append(adds, minus);
                                adds.onclick = () => {
                                    this.createOperation('');
                                    blocks.classList.remove('action__clicked');
                                }
                                minus.onclick = () => {
                                    this.createOperation('minus');
                                    blocks.classList.remove('action__clicked');
                                }
                            } else if (type === 'del') {
                                blocks.childNodes[1].remove();
                                adds.onclick = () => {
                                    adds.classList.remove('slide-down');
                                    options(blocks, buttonAdd, buttonMinus, 'list');
                                    setTimeout(() => {
                                        const listener = (e) => {
                                            if (e.target.classList[0] !== 'action__add-operation') {
                                                window.removeEventListener('click', listener);
                                                options(blocks, adds, minus, 'del');
                                                blocks.classList.remove('action__clicked');
                                            }
                                        }
                                        window.addEventListener('click', listener);
                                    })
                                }
                            }
                        }

                        addOperation.onclick = () => {
                            options(buttonContainer, addOperation, minusOperation, 'list');
                            setTimeout(() => {
                                const listener = (e) => {
                                    if (e.target.classList[0] !== 'action__add-operation') {
                                        window.removeEventListener('click', listener);
                                        options(buttonContainer, addOperation, minusOperation, 'del');
                                        buttonContainer.classList.remove('action__clicked');
                                    }
                                }
                                window.addEventListener('click', listener);
                            })
                        }
                        block.append(buttonContainer);
                        loading(document.querySelector('body'), false);
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

    createOperation(typeOperation, deletes = false, idOperation = '') {
        //  generateTitle
        const createList = (typeSelect, block, values, name, icon = false, currency, id) => {
            const value = values;
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
                this.accountsID = id;

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
                value.textContent = `${currency}`;
            }

            select.append(option);
        }

        function addCategory(block, type) {
            for (let x = 0; x < type.length; x += 1) {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('action__category-item');
                const img = document.createElement('img');
                img.src = `${type[x][1]}`;
                img.alt = '';
                categoryItem.append(img, type[x][0]);
                block.append(categoryItem);
                categoryItem.onclick = () => {
                    block.childNodes.forEach(value => {
                        if (value.classList.contains('chosen') === true) {
                            value.classList.remove('chosen');
                        }
                        categoryItem.classList.add('chosen');
                    })
                }
            }
        }


        loading(document.querySelector('body'));
        axios.get(`https://croesus-backend.herokuapp.com/accounts/all`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((responses) => {
                this.typeList = [];
                Object.keys(responses.data.accounts).forEach(value => {
                    Object.keys(responses.data.accounts[value]).forEach((item, index) => {
                        if (index === 0) {
                            this.typeList.push([`${responses.data.accounts[value].name}`, `./icon/${responses.data.accounts[value].icon}.svg`, `${responses.data.accounts[value].currency}`, `${responses.data.accounts[value][item]}`])
                        }
                    })
                })

                const accID = this.typeList[0][3];

                const block = this.appBlock;
                block.textContent = '';

                const div = document.createElement('div');
                div.classList.add('action__header');
                const sum = document.createElement('div');
                sum.classList.add('action__total');
                sum.textContent = `${this.totalSum} ${this.valueType}`;
                const save = document.createElement('div');
                save.classList.add('action__save');
                div.append(sum, save);


                const operationBlock = document.createElement('div');

                const amountBlock = document.createElement('div');
                amountBlock.classList.add('action__amount');
                const amountInput = document.createElement('input');
                amountInput.classList.add('action__amount-input');
                const amountSelect = document.createElement('div');
                amountSelect.classList.add('action__input-operation');
                amountSelect.textContent = `${this.typeList[0][2]}`;

                this.accountsID = accID;

                const amountName = document.createElement('div');
                amountBlock.append(amountInput, amountSelect, amountName);

                const category = document.createElement('div');
                category.classList.add('action__operation-category');
                if (typeOperation === '') {
                    category.classList.add('action__operation-category_minus');
                    this.lenguageSend.forEach(value => {
                        if (value[1] === localStorage.getItem('lang')) {
                            if (value[0] === 'Русский') {
                                addCategory(category, this.ruAddCategory);
                            } else if (value[0] === 'English') {
                                addCategory(category, this.addCategory);
                            }
                        }
                    })
                    this.operationType = true;
                } else {
                    this.lenguageSend.forEach(value => {
                        if (value[1] === localStorage.getItem('lang')) {
                            if (value[0] === 'Русский') {
                                addCategory(category, this.ruMinusCategory);
                            } else if (value[0] === 'English') {
                                addCategory(category, this.minusCategory);
                            }
                        }
                    })
                    this.operationType = false;
                }
                const typeBlock = document.createElement('div');
                typeBlock.classList.add('action__item-block');
                typeBlock.classList.add('action__input-account_select');
                const typeInput = document.createElement('div');
                typeInput.classList.add('action__input-cash');
                const img = document.createElement('img');
                img.src = `${this.typeList[0][1]}`;
                img.alt = '';
                typeInput.append(img, `${this.typeList[0][0]}`);
                typeInput.onclick = () => {
                    const typeSelectList = document.createElement('div');
                    typeSelectList.classList.add('action__input-cash');
                    typeSelectList.classList.add('action__list');
                    typeSelectList.classList.add('slide-up');
                    for (let x = 0; x < this.typeList.length; x += 1) {
                        createList(typeInput, typeSelectList, amountSelect, this.typeList[x][0], this.typeList[x][1], this.typeList[x][2], this.typeList[x][3]);
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
                typeBlock.append(typeInput);

                const questionBlock = document.createElement('div');
                questionBlock.classList.add('action__question');
                const question = document.createElement('span');
                question.classList.add('action__title-account');
                const flag = document.createElement('input');
                flag.type = 'checkbox';
                questionBlock.append(question, flag);


                const repeatDays = document.createElement('div');
                function daysWeek(data, blockItem, type = false) {
                    for (let x = 0; x < data.length; x += 1) {
                        const day = document.createElement('div');
                        day.classList.add('action__days-item');
                        day.textContent = `${data[x]}`;
                        blockItem.append(day);

                        day.onclick = () => {
                            blockItem.childNodes.forEach((value) => {
                                if (value.classList.contains('chosen') === true) {
                                    value.classList.remove('chosen');
                                }

                                if (type) {
                                    if (x === 1) {
                                        repeatDays.classList.add('actives-days');
                                    } else if (repeatDays.classList.contains('actives-days')) {
                                        repeatDays.classList.remove('actives-days');
                                        repeatDays.childNodes.forEach(value1 => {
                                            if (value1.classList.contains('chosen') === true) {
                                                value1.classList.remove('chosen');
                                            }
                                        })
                                    }
                                    day.classList.add('chosen');
                                } else if (type === false) {
                                    if (blockItem.classList.contains('actives-days')) {
                                    day.classList.add('chosen');
                                }
                            }
                        })
                        }
                    }
                }

                const repeatBlock = document.createElement('div');
                repeatBlock.classList.add('action__repeat-block');
                const repeat = document.createElement('div');
                repeat.classList.add('action__title-account');
                const repeatDayWeekYear = document.createElement('div');
                repeatDayWeekYear.classList.add('action__week');


                repeatDays.classList.add('action__week');
                repeatDays.classList.add('action__days');
                repeatBlock.append(repeat, repeatDayWeekYear, repeatDays);

                this.lenguageSend.forEach(value => {
                    if (value[1] === localStorage.getItem('lang')) {
                        if (value[0] === 'Русский') {
                            save.textContent = `${this.rusLang[0]}`;
                            amountName.textContent = `${this.rusLang[1]}`;
                            question.textContent = `${this.rusLang[2]}`;
                            repeat.textContent = `${this.rusLang[3]}`;
                            daysWeek(this.ruDaysWeek[0], repeatDayWeekYear, true);
                            daysWeek(this.ruDaysWeek[1], repeatDays);
                        } else if (value[0] === 'English') {
                            save.textContent = `${this.engLang[0]}`;
                            amountName.textContent = `${this.engLang[1]}`;
                            question.textContent = `${this.engLang[2]}`;
                            repeat.textContent = `${this.engLang[3]}`;
                            daysWeek(this.daysWeek[0], repeatDayWeekYear, true);
                            daysWeek(this.daysWeek[1], repeatDays);
                        }
                    }
                })


                operationBlock.append(amountBlock, category, typeBlock, questionBlock, repeatBlock);

                block.append(div, operationBlock);

                flag.onclick = () => {
                    if (flag.checked) {
                        repeatBlock.classList.add('active');
                    } else if (repeatBlock.classList.contains('active')) {
                        repeatDayWeekYear.childNodes.forEach((value, index) => {
                            if (value.classList.contains('chosen') === true) {
                                value.classList.remove('chosen');
                            }

                            const item = value;
                            if (index === 1) {
                                item.onclick = () => {
                                    repeatDays.classList.add('active');
                                }
                            } else {
                                item.onclick = () => {
                                    if (repeatDays.classList.contains('active')) {
                                        repeatDays.classList.remove('active');
                                    }
                                }
                            }
                        })
                        repeatDays.childNodes.forEach(value => {
                            if (value.classList.contains('chosen') === true) {
                                value.classList.remove('chosen');
                            }
                        })
                        repeatBlock.classList.remove('active');
                    }
                }

                if (deletes) {
                    const deletess = document.createElement('button');
                    deletess.classList.add('action__delete');
                    const delImg = document.createElement('img');
                    delImg.src = './icon/delete.svg';
                    delImg.alt = '';
                    deletess.append(delImg);

                    deletess.onclick = () => {
                        axios.delete(`https://croesus-backend.herokuapp.com/transactions/${idOperation}`,
                            {
                                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                            })
                            .then(() => {
                                this.generateTitle();
                            })
                            .catch(function (error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: `${error.response.data.message}`
                                })
                            })
                    }


                    block.append(deletess);
                }

                save.onclick = () => {
                    const checkList = [['Mo', '1'], ['Tu', '2'], ['We', '3'], ['Th', '4'], ['Fr', '5'], ['Sa', '6'], ['Su', '0']];
                    const ruCheckList = [['Пн', '1'], ['Вт', '2'], ['Ср', '3'], ['Чт', '4'], ['Пн', '5'], ['Сб', '6'], ['Вс', '0']];

                    let suma;
                    let types;
                    let delays;
                    let days;

                    if (Number.isInteger(+amountInput.value)) {
                        suma = amountInput.value;
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Нужно ввести числовое значение!'
                        })
                    }


                    category.childNodes.forEach(value => {
                        if (value.classList.contains('chosen')) {
                            this.lenguageSend.forEach(values => {
                                if (values[1] === localStorage.getItem('lang')) {
                                    if (values[0] === 'Русский') {
                                        this.ruAllCategory.forEach((value1, index) => {
                                            if (value.textContent === value1[0]) {
                                                const item = this.allCategory[index];
                                                [types] = item;
                                            }
                                        })
                                    } else if (values[0] === 'English') {
                                        types = value.textContent;
                                    }
                                }
                            })
                        }
                    })

                    repeatDayWeekYear.childNodes.forEach(value => {
                        if (value.classList.contains('chosen') === true) {
                            this.lenguageSend.forEach(value1 => {
                                if (value1[1] === localStorage.getItem('lang')) {
                                    if (value1[0] === 'Русский') {
                                        this.ruDaysWeek[0].forEach((values, index) => {
                                            if (value.textContent === values) {
                                                delays = this.daysWeek[0][index];
                                            }
                                        })
                                    } else if (value1[0] === 'English') {
                                        delays = value.textContent;
                                    }
                                }
                            })
                        }
                    })

                    repeatDays.childNodes.forEach(value => {
                        if (value.classList.contains('chosen') === true) {
                            this.lenguageSend.forEach(value1 => {
                                if (value1[1] === localStorage.getItem('lang')) {
                                    if (value1[0] === 'Русский') {
                                        ruCheckList.forEach(values => {
                                            if (values[0] === value.textContent) {
                                                days = values;
                                            }
                                        })
                                    } else if (value1[0] === 'English') {
                                        checkList.forEach(values => {
                                            if (values[0] === value.textContent) {
                                                days = values;
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                    if (days === undefined) {
                        days = ['', ''];
                    }
                    if (suma === '' || types === undefined) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Не всё заполнено!'
                        })
                    } else if ((flag.checked && delays === undefined) || (flag.checked && days === undefined)) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Выберите повторы!'
                        })
                    } else if (deletes) {
                        loading(document.querySelector('body'));
                        axios.put(`https://croesus-backend.herokuapp.com/transactions/${idOperation}`, {
                                accountId: `${this.accountsID}`,
                                type: types,
                                repeat: flag.checked,
                                delay: delays,
                                day: days[1],
                                sum: +suma
                            },
                            {
                                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                            })
                            .then(() => {
                                this.generateTitle();
                                loading(document.querySelector('body'), false);
                            })
                            .catch(function (error) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: `${error.response.data.message}`
                                })
                            })
                    } else {
                        loading(document.querySelector('body'));
                        console.log(this.operationType)
                        axios.post(`https://croesus-backend.herokuapp.com/transactions/`, {
                                accountId: `${this.accountsID}`,
                                type: types,
                                repeat: flag.checked,
                                delay: delays,
                                day: days[1],
                                sum: +suma,
                                income: this.operationType
                            },
                            {
                                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                            })
                            .then(() => {
                                this.generateTitle();
                                loading(document.querySelector('body'), false);
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
                }
                loading(document.querySelector('body'), false);
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
}

export default Operation;
