import axios from "axios";
import '../scss/style.scss';

import Menu from "./menu";
import Account from './account';
import Login from "./authorization";
import Footer from "./footer";
import loading from "./loading";


const menu = new Menu(document.querySelector(".menu"));
const login = new Login(document.querySelector(".action"));
const footer = new Footer(document.querySelector(".footer"));

menu.addMenuItems();
login.autorization();
footer.generateTitle();
if(localStorage.getItem('token')) {
    loading(document.querySelector('body'));
    axios.get(`https://croesus-backend.herokuapp.com/users`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
        .then(function (response) {
            localStorage.setItem('lang', `${response.data.user.settings.language}`);
            localStorage.setItem('cur', `${response.data.user.settings.currency}`);
            const account = new Account(document.querySelector(".action"));
            account.generateTitle();
            footer.generateTitle(true, response);
            loading(document.querySelector('body'), false);
        })
        .catch(function (error) {
            console.log(error);
        })
}
