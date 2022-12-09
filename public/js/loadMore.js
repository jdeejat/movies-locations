/* eslint-disable */
import { showAlert } from './alert';

export const loadMore = async (page = 0, limit = 12) => {
  // fetch data from the api
  const request = await fetch(`/?limit=${limit}&page=${page}`, {
    method: 'GET',
  });

  Toastify({
    text: 'This is a toast',
    duration: 3000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  return await request.text();
};
