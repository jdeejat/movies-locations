/* eslint-disable */
import { showAlert } from './alert';
import fetch from 'node-fetch';

export const loadMore = async (page = 0, limit = 12) => {
  // fetch data from the api
  const request = await fetch(`/?limit=${limit}&page=${page}`, {
    method: 'GET',
  });

  return await request.text();
};
