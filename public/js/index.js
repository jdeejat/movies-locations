/* eslint-disable */
import 'core-js/stable';
import { login } from './login';
import { signup } from './signup';
import { logout } from './logout';
import { initMapbox } from './mapbox';
import { userChange, passwordChange } from './changeAccount';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// INITIALIZE MAPBOX
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  initMapbox(locations);
}

// add event listener to the .form element
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get email and password by id
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

// sign up
if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get name email password and passwordConfirm by id
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (logoutBtn)
  // add event listener to the .nav__el--logout element
  logoutBtn.addEventListener('click', logout);

// add event listener to the .form-user-data element
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    userChange(form);
  });

// add event listener to the .form-user-data element
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // change value of .btn--save-password to 'Updating...'
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    // get password fields by id
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await passwordChange(currentPassword, newPassword, newPasswordConfirm);
    // change value of .btn--save-password to 'Save password'
    document.querySelector('.btn--save-password').textContent = 'Save password';
    // clear password fields
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
