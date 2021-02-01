import Account from './account'
import Operation from './operation'
import Analytics from './analytics'

const account = new Account(document.querySelector(".action"));
const operation = new Operation(document.querySelector(".action"));
const analytics = new Analytics(document.querySelector(".action"));

class Menu {
    constructor(block) {
        this.appBlock = block;
        this.icons = [['./icon/accounts.svg', './icon/card.svg'], ['./icon/operations.svg', './icon/operations-chosen.svg'], ['./icon/analytics.svg', './icon/analytics-chosen.svg'], ['./icon/options.svg', './icon/options-chosen.svg']];
        this.items = [account, operation, analytics];
    }

    addMenuItems() {
        for (let x = 0; x < this.icons.length; x += 1) {
            const img = document.createElement('img');
            img.classList.add('menu__item');
            img.src = `${this.icons[x][0]}`;
            img.alt = '';
            img.onclick = () => {
                this.appBlock.childNodes.forEach((value, index) => {
                    const item = value;
                    item.src = `${this.icons[index][0]}`;
                })
                img.src = `${this.icons[x][1]}`;
                this.items[x].generateTitle();
            }
            this.appBlock.append(img);
        }
        this.appBlock.childNodes[0].src = `${this.icons[0][1]}`
        this.appBlock.childNodes[3].classList.add('menu__hidden')
    }
}

export default Menu;