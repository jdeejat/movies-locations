/* eslint-disable */
import { showAlert } from './alert';

// // TESTING DOM elements
// const loginForm = document.querySelector('.form');

export const signup = async (name, email, password, passwordConfirm) => {
  // Send a POST request
  const request = await fetch('/api/v1/users/signup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      passwordConfirm,
    }),
  });
  const response = await request.json();
  if (response.status === 'success') {
    // show alert
    showAlert('success', 'You now have an account');
    // go to home page
    setTimeout(() => {
      location.assign('/');
    }, 1000);
  } else {
    showAlert('error', response.message);
  }
};
