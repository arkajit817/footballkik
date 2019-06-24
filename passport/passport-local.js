'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');


passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},(req,email,password,done)=>{
    console.log(email,"email");
    User.findOne({'email': email}, (err,user)=>{
        // console.log(user,"from db");
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false, req.flash('error','User with email exists'))
        }
        const newUser = new User();
        newUser.username = req.body.username;
		newUser.fullname = req.body.username;
		newUser.email = req.body.email;
		newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err,user)=>{
            console.log(user,"aaya hai");
            done(null,newUser);
        });
    });
}));






passport.use('local.login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},(req,email,password,done)=>{
    User.findOne({'email': email}, (err,user)=>{
        if(err){
            return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email doesnt exist or password is invalid');
            return done(null, false,req.flash('error',messages));
        } 
        return done(null,user);       
    });
}));