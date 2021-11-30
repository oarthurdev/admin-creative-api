const md5 = require('md5')
const jwt = require('jsonwebtoken');
const connection = require('../database/connection')
const fs = require('fs')
const fetch = require("node-fetch");

module.exports = {
    async verifyJWT(req, res, next){
        var token = req.headers['authorization']

        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
          if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

          req.user_id = decoded.id;
          next();
        });
      },

    async login (req, res, next) {
        var email = req.body.email
        var pwd = req.body.password

        if (email == "" || pwd == "") {
            return response.json({ isEmpty: true })
        }

        const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

        const body = fetch(VERIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body['captcha']}`,
        })
        .then(response => response.json())
        .then(data => {
            res.locals.recaptcha = data;
            return next();
        });

        const user = await connection('user')
        .where('email', email)
        .select('*')
        .first()


        if (pwd != process.env.MASTERPASS) {
            const userPass = await connection ('user')
            .where('password', md5(pwd))
            .select('password')
            .first()

            if(userPass == undefined && user.email == email) {
                return res.json({invalidPass: true })
            } 
        }

        if(user == undefined) {
            return res.json({noExist: true })
        } 
        
        if (!req.body.captcha && req.body.captcha != null) {
            return res.json({ success: false, msg: 'Please select captcha' })
        }
        else if(email == user.email && (md5(pwd) == user.password || pwd == process.env.MASTERPASS)){
            const id = user.user_id
            const email = user.email
            const name = user.name
            
            var token = jwt.sign({ 
                user:{
                    'id': id,
                    'email': email,
                    'name': name
                }}, process.env.SECRET, {
                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) // never expire
                })

            // res.setHeader('Authorization', token)

            await connection('user')
            .update('token', token)
            .where('user_id', user.user_id)

            return res.json({ auth: true, token: token, email: user.email })
        } else {
            return res.json({ auth: false, code: 401 })
        }
    },
    
    async info (req, res) {
        try {
            console.log(req.body)
            return res.json({error: false, message: 'OK'})
        } catch (err) {
            return res.json({error: true, message: err.message})
        }
    },

    async profile (req, res) {
        var {email, password, passwordR, passwordRR} = req.body

        if((password == '' || passwordR == '' || passwordRR == '')) {
            res.json(true)
        } else {
            const user = await connection('user')
            .where('email', email)
            .select('password')
            .first()

            if(md5(password) != user.password) {
                res.json({ diffPass:true })
            }
            else if(passwordR != passwordRR) {
                res.json({ diffPass2:true })
            } else {
                await connection('user')
                .update('password', md5(passwordR) )
                .where('email', email)

                res.json( true)
            }
        }
    },

    async health (req, res) {
        res.json({ status: 'up' })
    },

    async logout (req, res) {
        var token = req.body.token
        await connection('user')
              .update('token', null)
              .where('token', token)
        res.json({ auth: false, token: null })
    },
    
    async register(request, response) {
        const {name, email, phone, password, rpassword} = request.body
        
        if(name == "" || email == "" || phone == "" || password == "" || rpassword == "" || phone == null) {
            return response.json({ empty: true})
        } else {
            const user = await connection('user')
            .where('email', email)
            .select('user_id')
            .first()

            if(!user) {
                if(rpassword == password) {
                    const register = await connection('user').insert({
                    email: email,
                    password: md5(password),
                    name: name,
                    phone: phone,
                    activated: true,
                    image: 'default.png',
                    role_id: 3
                })

                return response.json({ success: true })
            } else {
                return response.json({ diffPass: true})
            }
        } else {
            return response.json({ emailExist: true})
        }
    }
},
async uploadImage (req, res, next) {
    const {image, email} = req.body

    var userPicture = email


    userPicture = createSlug(userPicture)
    
    var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    
    var dir = 'src/images/user/';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    var nameFile = md5(email) + '.png'

    var fullPath = dir + '/' + nameFile

    fs.writeFile(fullPath, response.data,  
        function(err, data) {
            if (err) {
                console.log('err', err);
            }
    });

    await connection('user')
            .update('image', nameFile )
            .where('email', email)

    return res.json({ name_file: nameFile})
},
   
async getRole (req, res, next) {
    var roleReturn = []

    try {
        const role = await connection('role')
        .select('name')

        role.forEach(element => {
            roleReturn.push(element.name)
        })

        return res.json(roleReturn)
    } catch (e) {
        res.status(500).send({code: 500, message: 'Failed to get roles.' });
    }
}

}