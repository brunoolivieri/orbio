/*

- Axios servirá como a ponte de comunicação com o backend via Ajax

*/

import axios from 'axios';

const api = axios.create({
    baseURL: window.location.origin
})

export default api;