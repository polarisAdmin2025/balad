'use client'

const API_BASE_URL = 'https://172.16.2.57/api/v1'

export const getAction = async (link) => {
  try {
    const response = await fetch(API_BASE_URL + link, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const postAction = async (link, appData) => {
  const jsonBody = JSON.stringify(appData);
  try {
    const response = await fetch(API_BASE_URL + link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonBody,
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const patchAction = async (link, appData) => {
  const jsonBody = JSON.stringify(appData);
  try {
    const response = await fetch(API_BASE_URL + link, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonBody,
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
export const deleteAction = async (link) => {
  const jsonBody = JSON.stringify();
  try {
    const response = await fetch(API_BASE_URL + link, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonBody,
    });
    return response.status;
  } catch (error) {
    return error;
  }
};
