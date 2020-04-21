import axios from 'axios';
// import authHeader from './Auth_header';

// const API_URL = 'https://cors-anywhere.herokuapp.com/http://localhost:8080/';
const API_URL = '/v1/';

class AuthService {
    // not sure about the token of response data
    // just temporarily named it as 'accessToken'
    login(username, password) {
        return axios
            .post(API_URL + "authenticate", {
                username,
                password
            },
            )
            .then(response => {
                console.log(response.data)
                if (response.data) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            })
            .catch(err => {
                console.log("error auth:::::"+err)
                return err;
            })
    }


    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("isCC");
    }

    register(username, password) {
        return axios.post(API_URL + "register", {
            username,
            password
        }, {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
        })
        .then(res => {
            console.log("Response::" +res.data)
            return res.data
        })
        .catch(err => {
            console.log("Error:::" + err);
            return err
        })
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();