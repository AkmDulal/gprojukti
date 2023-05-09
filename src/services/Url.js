import axios from 'axios';
const BASE_URL = 'https://testapi.gprojukti.com';
export default axios.create({
    baseURL: BASE_URL
});