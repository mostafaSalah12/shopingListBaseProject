var mongoose = require('mongoose');
var passport = require('passport');
require('../config/security')(passport);
var config = require('../config/keys');
var express = require('express');
var jwt = require('jsonwebtoken');
var User = require("../models/user");



module.exports.addUser = (req, res)=>{
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
      } else {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password,
          role:"USER"
        });
        // save the user
        var token = jwt.sign(newUser.toJSON(), config.secret, {expiresIn: 604800 });
        newUser.jwt = token;
        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, msg: 'Username already exists.'});
          }
         // res.json({success: true, msg: 'Successful created new user.'});
          //login(req, res);
        //  var token = jwt.sign(newUser.toJSON(), config.secret, {expiresIn: 604800 });
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        });
      }

}


module.exports.login = (req, res)=>{
    User.findOne({
        username: req.body.username
      }, function(err, user) {
        if (err) throw err;
    
        if (!user) {
          res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          // check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // if user is found and password is right create a token
              var token = jwt.sign(user.toJSON(), config.secret, {expiresIn: 604800 });
              // return the information including token as JSON
              user.jwt = token;
              user.save(function(err) {
                if (err) {
                  return res.json({success: false, msg: 'error'});
                }
              });

              res.json({success: true, token: 'JWT ' + token});
            } else {
              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
          });
        }
      });
}