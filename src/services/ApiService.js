import axios from "axios";

const API_URL = "http://localhost:9000";

//save token to local storage
const setAuthHeader = (token) => {
    localStorage.setItem("token", token);
};

//get token from local storage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {Authorization: `Bearer ${token}`}
}

//remove token from local storage

export const removeAuthHeader = (key) => {
    localStorage.removeItem(key);
};


//user requests
export const register = (user) => {
    return axios.post(`${API_URL}/users/register`, user);
}

export const login = async(credentials) => {
    const {data} = await axios.post(`${API_URL}/authenticate`, credentials);
    setAuthHeader(data.jwt);
    return data;
}

export const fetchCurrentUser = () => {
    return axios.get(`${API_URL}/users`, {headers: getAuthHeader()});
}

export const updateCurrentUser = (updatedCurrentUser) => {
    return axios.put(`${API_URL}/users`, updatedCurrentUser, {headers: getAuthHeader()});
}

export const deleteCurrentUser = () => {
    return axios.delete(`${API_URL}/users`, {headers: getAuthHeader()});
}


//item requests
export const fetchItemByTitle = (title) => {
    return axios.get(`${API_URL}/items/by-title?title=${title}`);
}

export const fetchAllItems = () => {
    return axios.get(`${API_URL}/items/all`);
}


//favorites list requests
export const fetchFavoritesList = () => {
    return axios.get(`${API_URL}/favorite-list/all`, {headers: getAuthHeader()});
}

export const addToFavoritesList = (itemTitle) => {
    return axios.post(`${API_URL}/favorite-list/add-item`, {itemTitle}, {headers: getAuthHeader()});
}

export const removeFromFavoritesList = (itemTitle) => {
    return axios.put(`${API_URL}/favorite-list/remove-item`, {itemTitle}, {headers: getAuthHeader()});
}

export const clearFavoritesList = () => {
    return axios.delete(`${API_URL}/favorite-list/remove-all`, {headers: getAuthHeader()});
}


//order requests
export const addItemToOrder = (order) => {
    return axios.post(`${API_URL}/orders/add-item`, {order}, {headers: getAuthHeader()});
}

export const removeItemFromOrder = (item) => {
    return axios.put(`${API_URL}/orders/remove-item`, {item}, {headers: getAuthHeader()});
}

export const placeOrder = () => {
    return axios.post(`${API_URL}/orders/payment`, {headers: getAuthHeader()});
}

export const fetchAllOrders = () => {
    return axios.get(`${API_URL}/orders/all`, {headers: getAuthHeader()});
}