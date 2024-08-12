import { HttpMethods, StatusCodes } from '../consts';

export const buildRoute = () => ({
  route: '/newRoute',
  httpMethod: HttpMethods.GET,
  statusCode: StatusCodes.OK,
  delay: '0',
  payload: { test: true }
});

export const createNewRoute = async (route) => {
  return await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(route)
  });
};

export const updateRoute = async (data) => {
  return await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/route`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

export const deleteRoute = async (data) => {
  return await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/route`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};


export const geteRoute = async (data) => {
  const rotues = await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/route`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return rotues
};


export const updateSettings = async (settings) => {
  return await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
};

export const getSettings = async () => {
  return await fetch(`${process.env.REACT_APP_MOCKIT_API_URL}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};