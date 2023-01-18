const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const {generateToken} = require('../middlewares/index')

const getUsers = async(req, res) => {
     User.find((err, data) => {
        if(err){
          res.status(404).send(err)
        }else{
          res.status(201).send(data);
        }
    })
}

const createUser = async(req, res) => {
    const user = await User.findOne({email: req.body.email});
  if(user){
    res.status(400).send({msg: "user already registered"})
  }else{
    const newUser = new User({
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, 8),
      email: req.body.email
    })

    const createdUser = await newUser.save();
        res.status(200).send({
            _id : createdUser._id,
            name: createdUser.name,
            email: createdUser.email
        });
  }
}

const signinUser = async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
      res.status(400).send({msg: "user not already registered"})
    }else{
      if(bcrypt.compareSync(req.body.password, user.password)){
        res.send({
            _id : user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user)
        });
        
    } else{
        res.status(400).send({msg: "wrong password"})
    }
    }
}

const getUserById = async(req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {getUsers, createUser, signinUser, getUserById};