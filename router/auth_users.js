const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 

    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 

    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  console.log("Access Token: " + accessToken + " Username: " + username);
  req.session.username=username;
  console.log("req.session.authorization: " + req.session.authorization);
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const based_isbn = req.params.isbn;
    console.log(based_isbn);
    let filtered_book = books[based_isbn]
    console.log(filtered_book);
    if (filtered_book) { 
        let new_review = req.query.review;
        console.log("New Review: "+new_review)
        for(var key in books) {
            if(books.hasOwnProperty(key)) {
                var value = books[key];
                console.log("Value: "+value)
                if  (key == based_isbn) {
                    value["reviews"] = new_review;
                    console.log("Updated value reviews: " + value["reviews"]);
                }

            }
        }

        res.send(`The review for the book with isbn ${based_isbn} has been added/updated. `)
    }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const loginedUserName =  req.session.username;
    console.log("Username: " + loginedUserName);
    const based_isbn = req.params.isbn;
    console.log(based_isbn);
    let filtered_book = books[based_isbn]
    console.log(filtered_book);
    if (filtered_book) { 
        let new_review = {};
        console.log("New Review: "+new_review)
        for(var key in books) {
            if(books.hasOwnProperty(key)) {
                var value = books[key];
                console.log("Value: "+value)
                if  (key == based_isbn) {
                    value["reviews"] = new_review;
                    console.log("Updated value reviews: " + value["reviews"]);
                }

            }
        }

        res.send(`Review for the book with isbn ${based_isbn} by ${loginedUserName} has been deleted. `);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;