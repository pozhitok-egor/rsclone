import Account from './account'
import Operation from './operation'

const account = new Account(document.querySelector(".action"));
const operation = new Operation(document.querySelector(".action"));

class Menu {
    constructor(block) {
        this.appBlock = block;
        this.icons = ['./icon/card.svg', './icon/operations.svg', './icon/analytics.svg', './icon/options.svg'];
        this.items = [account, operation];
    }

    addMenuItems() {
        for (let x = 0; x < this.icons.length; x += 1) {
            const img = document.createElement('img');
            img.src = `${this.icons[x]}`;
            img.alt = '';
            img.onclick = () => {
                this.items[x].generateTitle();
            }
            this.appBlock.append(img);
            // account.generateTitle();
            //
            // operation.createOperation('add');
        }
    }
}

export default Menu;