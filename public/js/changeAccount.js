/* eslint-disable */
import { showAlert } from './alert';

export const userChange = async (email, name) => {
  // Send a POST request
  const request = await fetch('http://localhost:3000/api/v1/users/updateMe', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
    }),
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
  const request = await fetch(
    'http://localhost:3000/api/v1/users/updatePassword',
    {
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
    }
  );
  const response = await request.json();
  if (response.status === 'success') {
    // show alert
    showAlert('success', 'Password updated');
  } else {
    showAlert('error', response.message);
  }
};
