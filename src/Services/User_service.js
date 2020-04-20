
import axios from 'axios';
import authHeader from './Auth_header';

const API_URL = '/v1/';

class UserService {
    
    getProfile() {
        return axios.get(API_URL + 'profile', {headers: {'Authorization': 'Bearer ' + authHeader()}});
    }

    saveProfile(fname, lname) {
        return axios.post(API_URL + 'profile', {
            firstName: fname,
            lastName: lname
        }, { headers: { 'Authorization': 'Bearer ' + authHeader()}});
            
    }
    
    addPayment(cardNumber, eMonth, eYear, c) {
        var info = {
            creditCardNumber: cardNumber,
            expiryMonth: eMonth,
            expiryYear: eYear,
            cvc: c
        }
        
        return axios.post(API_URL + 'addPayment', info, {
            headers: { 'Authorization': 'Bearer ' + authHeader() }
        }).then(res => {
            localStorage.setItem("isCC", true);
            return res.data;
        })
        .catch(err => {
            localStorage.setItem("isCC", false);
            console.log(err);
            return err.data;
        })
    }

    getHistory() {
        return axios.get(API_URL + 'history', { headers: { 'Authorization': 'Bearer ' + authHeader() } })
            .then(res => {
                return res.data
            })
    }
}


export default new UserService();