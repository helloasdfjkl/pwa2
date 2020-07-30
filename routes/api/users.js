const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validatePasswordChange = require("../../validation/profile.js");

//Models
const User = require("../../models/User");
const Item = require('../../models/Item');

//image processing
// var fs = require('fs');
// var multer = require('multer');
//
// router.use(
//   multer({
//     dest: './uploads/',
//     rename: function (fieldname, filename) {
//       return filename;
//     },
//   }).single('photo')
// );
//
// router.post('photo', function(req,res){
//   var newItem = new Item();
//   newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
//   newItem.img.contentType = ‘image/png’;
//   newItem.save();
// });

router.post("/changeProfile", (req, res) => {
  const {errors, isValid} = validatePasswordChange(req.body);
  const {name, email, oldpassword, password} = req.body;

  if(!isValid) {
    console.log("hello");
    return res.status(400).json(errors);
  }
  User.findOne({email: email}).then(user => {
    if(name != user.name) {
      user.name = name;
      user
        .save()
        .catch(err => console.log(err));
      if(password == "") {
        return res.status(400).json({success: "Profile Changed"});
      }
    }

    if(password != "") {
    bcrypt.compare(oldpassword, user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .catch(err => console.log(err));
          });
        });

      } else {
        console.log("bad password");
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  }
  })


})
// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        //this makes this information accessible to react by calling this.props.auth
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,

        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
