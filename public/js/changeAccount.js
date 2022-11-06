/* eslint-disable */
import { showAlert } from './alert';
import fetch from 'node-fetch';

export const userChange = async (form, name) => {
  // Send a POST request
  // dev url http://localhost:3000/api/v1/users/updateMe
  const request = await fetch('/api/v1/users/updateMe', {
    method: 'PATCH',
    body: form,
  });
  const response = await request.json();
  if (response.status === 'success') {
    // show alert
    showAlert('success', 'Data updated');
  } else {
    showAlert('error', response.message);
  }
};

export const passwordChange = async (
  currentPassword,
  newPassword,
  newPasswordConfirm
) => {
  // Send a POST request
  const request = await fetch('/api/v1/users/updatePassword', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    }),
  });
  const response = await request.json();
  if (response.status === 'success') {
    // show alert
    showAlert('success', 'Password updated');
  } else {
    showAlert('error', response.message);
  }
};
