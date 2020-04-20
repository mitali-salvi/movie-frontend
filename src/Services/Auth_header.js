
export default function authHeader() {
    const tokenObj = JSON.parse(localStorage.getItem("user"));

    if (tokenObj) {
        console.log(tokenObj.token);
        return tokenObj.token
    }
    else {
        return {};
    }
}