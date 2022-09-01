/* eslint-disable */
import { showAlert } from './alert';

// // TESTING DOM elements
// const loginForm = document.querySelector('.form');

export const logout = async () => {
  // Send a POST request
  const request = await fetch('http://localhost:3000/api/v1/users/logout', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const response = await request.json();
  if (response.status === 'success') {
    showAlert('success', 'You are now logged out');
    setTimeout(() => {
      location.reload(true);
    }, 2000);
  } else {
    showAlert('error', 'Something went wrong. Try again!');
  }
};
