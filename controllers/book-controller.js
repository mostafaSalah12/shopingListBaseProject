var mongoose = require('mongoose');
var passport = require('passport');
require('../config/security')(passport);
var jwt = require('jsonwebtoken');
var User = require("../models/user");
var Book = require("../models/book");

var secHelper = require('./security-helper');

module.exports.addNewBook = (req, res)=> {
    var token = secHelper.getToken(req.headers);
    if (token) {
       secHelper.isAuthorized(token,'USER', (success, error)=>{
         if(success){
        var newBook = new Book({
          isbn: req.body.isbn,
          title: req.body.title,
          author: req.body.author,
          publisher: req.body.publisher
        
        });
      
        newBook.save(function(err) {
          if (err) {
            return res.json({success: false, msg: 'Save book failed.'});
          }
          res.json({success: true, msg: 'Successful created new book.'});
        });
      }
        if(error){
          return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
      });
    //  return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
}


module.exports.getBooks =(req, res)=> {
    var token = getToken(req.headers);
    if (token) {
      if(secHelper.isAuthorized(token, "USER")){
        Book.find(function (err, books) {
          if (err) return next(err);
          res.json(books);
        });
      }else{
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
    
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  }