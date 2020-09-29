import axios from 'axios';

const api = axios.create({
    baseURL: "https://events-site-app.herokuapp.com/"
})

export default api;