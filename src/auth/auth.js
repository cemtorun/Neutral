function userLogin(identifier, password, callback) {

}

function userLogout() {

}

function userRegister(username, email, password, callback) {

}

function isLoggedIn() {
    return true;
}

function getUser() {
    return {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTg3ODU2NTE5LCJleHAiOjE2MTkzOTI1MTl9.Bm_8EPmH2zxSu7pl4kQvW7SlbSovfD_L1G9XQpFu6Hc",
        "user": {
            "id": 2,
            "username": "newuser1",
            "email": "neutral_test001@zharry.ca",
            "provider": "local",
            "confirmed": true,
            "blocked": null,
            "role": {
                "id": 1,
                "name": "Authenticated",
                "description": "Default role given to authenticated user.",
                "type": "authenticated"
            },
            "created_at": "2020-04-25T16:39:24.000Z",
            "updated_at": "2020-04-25T16:39:24.000Z",
            "purchases": []
        }
    }
}