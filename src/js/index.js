import '../scss/style.scss';

import Login from './authorization'

const login = new Login(document.querySelector(".action"));

login.autorization();
