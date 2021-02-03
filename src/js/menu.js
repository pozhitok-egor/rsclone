import Account from './account'
import Operation from './operation'
import Analytics from './analytics'

const account = new Account(document.querySelector(".action"));
const operation = new Operation(document.querySelector(".action"));
const analytics = new Analytics(document.querySelector(".action"));

class Menu {
    constructor(block) {
        this.appBlock = block;
        this.icons = [['./icon/accounts.svg', './icon/card.svg'], ['./icon/operations.svg', './icon/operations-chosen.svg'], ['./icon/analytics.svg', './icon/analytics-chosen.svg'], ['./icon/options.svg', './icon/options.svg']];
        this.items = [account, operation, analytics];
        this.lenguageSend = [['Русский', 'ru'], ['English', 'en']];
    }

    addMenuItems() {
        this.appBlock.textContent = '';
        for (let x = 0; x < this.icons.length; x += 1) {
            const button = document.createElement('button');
            const img = document.createElement('img');
            img.classList.add('menu__item');
            img.src = `${this.icons[x][0]}`;
            img.alt = '';
            button.onclick = () => {
                this.appBlock.childNodes.forEach((value, index) => {
                    const item = value.childNodes[0];
                    item.src = `${this.icons[index][0]}`;
                    if (value.classList.contains('clicked')) {
                        value.classList.remove('clicked');
                    }
                })
                img.src = `${this.icons[x][1]}`;
                this.items[x].generateTitle();
                button.classList.add('clicked');
            }
            button.append(img);
            button.disabled = true;
            this.appBlock.append(button);
        }

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const func = () => {
            if (window.innerWidth > 600) {
                popup.remove();
                if (document.querySelector('footer').classList.contains('actives')) {
                    document.querySelector('footer').classList.remove('actives')
                    window.removeEventListener('resize', func);
                }
            }
        }
        this.appBlock.childNodes[0].childNodes[0].src = `${this.icons[0][1]}`;
        this.appBlock.childNodes[0].classList.add('clicked');
        this.appBlock.childNodes[3].classList.add('menu__hidden');
        this.appBlock.childNodes[3].onclick = () => {
            if (document.querySelector('.footer').classList.contains('actives')) {
                document.querySelector('.footer').classList.remove('actives');
                window.removeEventListener('resize', func);
                if (document.querySelector('body').lastElementChild.classList.contains('popup')) {
                    popup.remove();
                }
            } else {
                document.querySelector('.footer').classList.add('actives');
                window.addEventListener('resize', func);
                if (document.querySelector('body').lastElementChild.classList.contains('popup') === false) {
                    document.querySelector('body').append(popup)
                }
            }
        }
    }
}

export default Menu;