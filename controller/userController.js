const tokenGenerator = require("../auth/auth").tokenGenerator;
const express = require('express');

const User = require("../models/userModel");
const FileModel = require("../models/fileModel");
const bcrypt = require("bcrypt");


async function signup(req, res) {
  const { fullName, email, password, cPassword } = req.body;

  if (![fullName, email, password, cPassword].every(Boolean)) {
    return res.status(405).json({ error: "All Fields Are Required" });
  }

  try {
    const data = await User.findOne({ email: email, status: "ACTIVE" });

    if (data && data?.email == email) {
      return res.status(401).json({ message: "Email Already In Use." })
    }

    if (data && password !== cPassword) {
      return res.status(403).json({ message: "Password and Confirm Password must be the same" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName: fullName, email: email, password: hashedPassword });
    await newUser.save();

    const rootFolder = new FileModel({
      fileName: "root",
      number: 1,
      parentId: null,
      isFile: false,
      userId: newUser._id,
      location: null,
      isFavorite: false,
      fileExtension: null,
      status: "ACTIVE",
    });

    await rootFolder.save();

    return res.status(200).json({ message: "Signed Up Successfully. Please Login from the login page.", });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, status: "ACTIVE" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect === true) {
      return tokenGenerator(res, user)
    }
    return res.status(405).json({ message: "Incorrect Password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = { signup, login };
