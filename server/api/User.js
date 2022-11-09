const express = require('express')
const router = express.Router()

//mongodb user model
const User = require('./../models/User')

//mongodb userOTPVerification model
const UserOTPVerification = require('./../models/UserOTPVerification')

//env variables
require('dotenv').config()

//email handler
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
})

//Password Handler
const bcrypt = require('bcrypt')

//jsonwebtoken
const jwt = require('jsonwebtoken')


router.post("/register", (req, res) => {
  let { fname, lname, email, password } = req.body
  fname = fname.trim()
  lname = lname.trim()
  email = email.trim()
  password = password.trim()

    if(fname == "" || lname =="" || email == "" || password == "" ){
        res.send({ status: "data error" })
    }else if(!/^[a-zA-Z]*$/.test(fname)){
        res.send({ status: "fname error" })
    }else if (!/^[a-zA-Z]*$/.test(lname)){
        res.send({ status: "lname error" })
    }else if (!/^[\w+\.]+@([\w+]+\.)+[\w-]{2,4}$/.test(email)){
        res.send({ status: "email error" })
    }else if (password.length < 8 ){
        res.send({ status: "password error" })
    }else{
        //Checking if user already exist
        User.find({email}).then(result => {
            if(result.length){
                return res.json({ error: "User Exists" })
            }else{
               //Try to create a new user
                
               //password handling
                const saltRounds = 10
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User ({
                    fname,
                    lname,
                    email,
                    password: hashedPassword,
                    verified: false,
                })

                newUser.save().then(result => {
                    
                    sendOTPVerificationEmail(result, res)
                    //res.send({ status: "ok" })
                })
                .catch( e => {
                    res.send({ status: "error" })
                })

               })
               .catch( e => {
                    return res.json({ error: "User Exists" })
                    res.send({ status: "error" })
               })

            }
        }).catch(e => {
            console.log(e)
            res.send({ status: "error" })
        })
    }
    
})


router.post("/login-user", (req, res) => {
    let { email, password } = req.body

    email = email.trim()
    password = password.trim()

    if(email == "" || password == "" ){
        res.send({ status: "data error" })
    }else{
        //Check if the user exists
        User.find({email})
        .then( data => {
            if(data.length){
                //User exists 

                const hashedPassword = data[0].password
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        //Password match
                        const token = jwt.sign({ email: email }, process.env.JWT_SECRET)
                        return res.json({ status: "ok", data: data, act: token })
                    }else{
                        return res.json({ status: "error", error: "Invalid Password" })
                    }
                })
                .catch(e => {
                    res.json({ status: "password match error"})
                })
            }else{
                res.json({ status: "Invalid Credentials"})
            }
        })
        .catch(e => {
            res.json({ status: "searching user failed"})
        })
    }


});


 router.post("/userData", async (req, res) => {
 const { token } = req.body;
 try {
   const user = jwt.verify(token, process.env.JWT_SECRET);
   console.log(user);

   const useremail = user.email;
   User.findOne({ email: useremail })
     .then((data) => {
       res.send({ status: "ok", data: data });
     })
     .catch((error) => {
       res.send({ status: "error", data: error });
     });
 } catch (error) {}
});

//Send otp verification email
const sendOTPVerificationEmail = async ({ _id,email }, res) => {
    
    try{
        const otp = `${Math.floor(1000 + Math.random()*9000)}`

        //mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Verify your Email',
            html: `<p>Enter ${otp}</b> in the app to verify your email </p><p>This code expires in 1 hour</p>`,
        }

        //hash the otp
        const saltRounds =10
        const hashedOTP = await bcrypt.hash(otp, saltRounds)
        const newOTPVerification = await new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })

        //save otp record
        await newOTPVerification.save()

        await transporter.sendMail(mailOptions)
        .then(() => {
            res.send({
                status: 'ok',
                message:'Verification otp sent',
                data: {
                    userId: _id,
                    email,
                },
            })
        })
        .catch((e) => {
            console.log(e)
            res.send({
                status: 'verification error'
            })
        }) 
       
    }catch(e){

    }
}

module.exports = router