import axios from "axios";
import '../scss/style.scss';

import Menu from "./menu";
import Account from './account';
import Login from "./authorization";


const menu = new Menu(document.querySelector(".menu"));
const login = new Login(document.querySelector(".action"));


menu.addMenuItems()
login.autorization();
if(localStorage.getItem('token')) {
    axios.get(`https://croesus-backend.herokuapp.com/users`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
        .then(() => {
            const account = new Account(document.querySelector(".action"));
            account.generateTitle();
        })
        .catch((error) => {
            console.error(error);
        })
}
