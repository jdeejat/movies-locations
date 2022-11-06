/* eslint-disable */
import { showAlert } from './alert';
import fetch from 'node-fetch';

// // TESTING DOM elements
// const loginForm = document.querySelector('.form');

export const login = async (email, password) => {
  // Send a POST request
  const request = await fetch('/api/v1/users/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const response = await request.json();
  if (response.status === 'success') {
    // show alert
    showAlert('success', 'You are now logged in');
    // go to home page
    setTimeout(() => {
      location.assign('/');
    }, 1000);
  } else {
    showAlert('error', response.message);
  }
};

// // TESTIN add event listener to the .form element
// if (loginForm) {
//   loginForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     // get email and password by id
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
//   });
// }

///////////////////////
// OLD AXIOS VERSION
///////////////////////

//import axios from 'axios';

// export const login = async (email, password) => {
//   try {
//     // Send a POST request
//     const response = await axios({
//       method: 'post',
//       url: 'http://localhost:3000/api/v1/users/login',
//       data: {
//         email,
//         password,
//       },
//     });
//     if (response.data.status === 'success') {
//       // go to home page
//       setTimeout(() => {
//         location.assign('/');
//       }, 500);
//     }
//   } catch (error) {
//     alert(error.response.data.message);
//   }
// };
