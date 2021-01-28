import axios from "axios";

class Operation {
    constructor(block) {
        this.appBlock = block;
        this.typeList = [];
        // ['Cash', './icon/cash.svg'], ['Web', './icon/web.svg'], ['Card', './icon/card.svg']
        this.accountsID = '';
        this.operationType = '';
        this.totalSum = 0;
        this.valueType = 'USD';
        this.addCategory = [['cafe', './icon/food.svg'], ['health', './icon/health.svg'], ['food', './icon/foods.svg'], ['family', './icon/family.svg'], ['rest', './icon/rest.svg'], ['study', './icon/study.svg'], ['gifts', './icon/gifts.svg'], ['shopping', './icon/shopping.svg'], ['home', './icon/home.svg'], ['car', './icon/car.svg'], ['care', './icon/care.svg'], ['other', './icon/other.svg']];
        this.minusCategory = [['salary', './icon/cash.svg'], ['other', './icon/other.svg']];
        this.allCategory = [['cafe', './icon/foods.svg'], ['health', './icon/health.svg'], ['food', './icon/food.svg'], ['family', './icon/family.svg'], ['rest', './icon/rest.svg'], ['study', './icon/study.svg'], ['gifts', './icon/gifts.svg'], ['shopping', './icon/shopping.svg'], ['home', './icon/home.svg'], ['car', './icon/car.svg'], ['care', './icon/care.svg'], ['salary', './icon/cash.svg'], ['other', './icon/other.svg']]
        this.daysWeek = [['Day', 'Week', 'Month', 'Year'], ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']];
        this.dataOperation = [];
    }

    generateTitle() {
        axios.get(`https://croesus-backend.herokuapp.com/transactions/all`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((responses) => {
                Object.keys(responses.data.transactions).forEach(value => {
                    const massData = [];
                    Object.keys(responses.data.transactions[value]).forEach((data, index) => {
                        if (index === 0) {
                            massData.push(responses.data.transactions[value].accountId, responses.data.transactions[value].type, responses.data.transactions[value].sum, responses.data.transactions[value].createdAt, responses.data.transactions[value].income);
                        }
                    });
                    this.dataOperation.push(massData);
                })

        const mounth = ["January", "February", "March", "April", "May", "June", "July", "August", "Septeber", "October", "November", "December"];
        // addOperation
        const block = this.appBlock;
        block.textContent = '';

        const sort = [];

        for (let x = 0; x < this.dataOperation.length; x += 1) {
            console.log(this.dataOperation[x])
            const mass = []
            for (let z = x; z < this.dataOperation.length; z += 1) {
                if (this.dataOperation[x][3].split('T')[0] === this.dataOperation[z][3].split('T')[0]) {
                    mass.push(this.dataOperation[z]);
                }
            }
            sort.push(mass);
            x += sort.flat(1).length - 1;
        }

        console.log(sort)

        axios.get(`https://croesus-backend.herokuapp.com/users`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((response) => {
                console.log(response);
                this.valueType = response.data.user.settings.currency;
                this.totalSum = response.data.user.settings.totalSum;

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

                    blockTitle.textContent = `${date[0]} ${mounth[date[1] - 1]} ${date[2]}`;
                    const operationBlock = document.createElement('div');
                    operationBlock.classList.add('action__operation-list');
                    value.forEach((item) => {
                        const typeItem = item[1];
                        const sumItem = item[2];
                        const incomeItem = item[4];

                        axios.get(`https://croesus-backend.herokuapp.com/accounts/${item[0]}`, {
                            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                        })
                            .then((responsess) => {
                                console.log(responsess)
                                const div = document.createElement('div');
                                div.classList.add('action__operation-item');
                                const typeSection = document.createElement('div');
                                typeSection.classList.add('action__type-section');
                                const valuesSection = document.createElement('div');
                                if (incomeItem) {
                                    valuesSection.classList.add('action__refill');
                                    valuesSection.textContent = `+${sumItem}${responsess.data.account.currency}`
                                } else {
                                    valuesSection.classList.add('action__cash-out');
                                    valuesSection.textContent = `-${sumItem}${responsess.data.account.currency}`
                                }
                                const img = document.createElement('img');
                                for (let z = 0; z < this.allCategory.length; z += 1) {
                                    if (item[1].toUpperCase() === this.allCategory[z][0].toUpperCase()) {
                                        img.src = `${this.allCategory[z][1]}`;
                                    }
                                }
                                img.alt = '';
                                const nameDiv = document.createElement('div');
                                // nameDiv.classList.add('action__')
                                const type = document.createElement('div');
                                type.textContent = typeItem[0].toUpperCase() + typeItem.slice(1);
                                const name = document.createElement('div');
                                name.textContent = responsess.data.account.name[0].toUpperCase() + responsess.data.account.name.slice(1);
                                name.classList.add('action__name');
                                nameDiv.append(type, name);
                                typeSection.append(img, nameDiv);

                                div.append(typeSection, valuesSection);
                                operationBlock.append(div);
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    })
                    dayBlock.append(blockTitle, operationBlock);

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
                            blocks.append(buttonMinus);
                            adds.onclick = () => {
                                this.createOperation('');
                            }
                            minus.onclick = () => {
                                this.createOperation('minus');
                            }
                        } else if (type === 'del') {
                            blocks.childNodes[1].remove();
                            adds.onclick = () => {
                                options(blocks, buttonAdd, buttonMinus, 'list');
                                setTimeout(() => {
                                    const listener = (e) => {
                                        console.log(e.target.classList);
                                        if (e.target.classList[0] !== 'action__add-operation') {
                                            window.removeEventListener('click', listener);
                                            options(blocks, adds, minus, 'del');
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
                                }
                            }
                            window.addEventListener('click', listener);
                        })
                    }
                    block.append(dayBlock, buttonContainer);
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    })
.catch(function (error) {
        console.log(error);
    })
    }

    createOperation(typeOperation) {
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


        axios.get(`https://croesus-backend.herokuapp.com/accounts/all`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        })
            .then((responses) => {
                console.log(responses)
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
                save.textContent = 'Save';
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
                amountName.textContent = 'Amount';
                amountBlock.append(amountInput, amountSelect, amountName);

                const category = document.createElement('div');
                category.classList.add('action__operation-category');
                if (typeOperation === '') {
                    addCategory(category, this.addCategory);
                    this.operationType = true;
                } else {
                    category.classList.add('action__operation-category_minus');
                    addCategory(category, this.minusCategory);
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
                question.textContent = 'Repeat Transaction?';
                const flag = document.createElement('input');
                flag.type = 'checkbox';
                questionBlock.append(question, flag);

                function daysWeek(data, blockItem) {
                    for (let x = 0; x < data.length; x += 1) {
                        const day = document.createElement('div');
                        day.classList.add('action__days-item');
                        day.textContent = `${data[x]}`;
                        blockItem.append(day);

                        day.onclick = () => {
                            blockItem.childNodes.forEach(value => {
                                if (value.classList.contains('chosen') === true) {
                                    value.classList.remove('chosen');
                                }
                            })
                            day.classList.add('chosen');
                        }
                    }
                }

                const repeatBlock = document.createElement('div');
                const repeat = document.createElement('div');
                repeat.classList.add('action__title-account');
                repeat.textContent = 'Repeat every:';
                const repeatDayWeekYear = document.createElement('div');
                repeatDayWeekYear.classList.add('action__week');
                daysWeek(this.daysWeek[0], repeatDayWeekYear);
                const repeatDays = document.createElement('div');
                repeatDays.classList.add('action__week');
                daysWeek(this.daysWeek[1], repeatDays);
                repeatBlock.append(repeat, repeatDayWeekYear, repeatDays);

                operationBlock.append(amountBlock, category, typeBlock, questionBlock, repeatBlock);

                block.append(div, operationBlock);

                save.onclick = () => {

                    let suma;
                    let types;
                    let delays;
                    let days;

                    if (Number.isInteger(+amountInput.value)) {
                        suma = amountInput.value;
                    } else {
                        alert('Нужно число!')
                    }


                    category.childNodes.forEach(value => {
                        if (value.classList.contains('chosen')) {
                            types = value.textContent;
                        }
                    })

                    repeatDayWeekYear.childNodes.forEach(value => {
                        if (value.classList.contains('chosen') === true) {
                            delays = value.textContent;
                        }
                    })
                    repeatDays.childNodes.forEach(value => {
                        if (value.classList.contains('chosen') === true) {
                            days = value.textContent;
                        }
                    })
                    if (suma === '' || types === '' || delays === '' || days === '') {
                        alert('НЕ заполнено!!!!')
                    } else {
                        axios.post(`https://croesus-backend.herokuapp.com/transactions/`, {
                                accountId: `${this.accountsID}`,
                                type:  types,
                                repeat: flag.checked,
                                delay: delays,
                                day: days,
                                sum: +suma,
                                income: this.operationType
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
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export default Operation;
