const jwt = require('jsonwebtoken');

require("dotenv-safe").config()

getHeaders = (token) => {
    try {
        let user = {}

        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            user = decoded.user
        })

        return user
    } catch (e) {
        console.log(e)
    }

}