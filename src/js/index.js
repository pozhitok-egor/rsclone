import '../scss/style.scss';

// import Login from './authorization'
import Account from './account'

// const login = new Login(document.querySelector(".action"));
// login.registration();

const account = new Account(document.querySelector(".action"));
account.generateTitle();
