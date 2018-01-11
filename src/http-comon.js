import axios from 'axios';


// export const restAddress = 'http://localhost:8081/';

export const pewaHttp = axios.create({
    baseURL: 'http://localhost:8081/',
    headers: {
        'Content-Type':'application/json'
    }
})


export const HTTP = axios.create({
    baseURL: 'http://jsonplaceholder.typicode.com',
    headers: {
        
    }
})