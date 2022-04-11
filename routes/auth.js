const express = require("express");
const router = express.Router();

const User = require('./../models/User')
const bcrypt = require('bcrypt')

const yup = require('yup');
const jsonwebtoken = require("jsonwebtoken");


router.post('/sign-up', async (req, res) => {
  try {
    await yup.object({
      name: yup.string().required().min(3),
      email: yup.string().email(),
      password: yup.string().required().min(6)
    })
      .validate(req.body)
  } catch (e) {
    return res.json(e.errors)
  }

  if (await User.exists({ email: req.body.email }).exec()) {
    return res.json({
      error: "This email is already used"
    })
  }

  let userData = req.body

  userData.password = await bcrypt.hash(userData.password, 10);

  const user = await User.create(userData)

  return res.json({
    token: generateAccessToken(user)
  })
})

router.post('/log-in', async (req, res) => {
  try {
    await yup.object({
      email: yup.string().email(),
      password: yup.string().required().min(6)
    })
      .validate(req.body)
  } catch (e) {
    return res.json(e.errors)
  }

  const user = await User.findOne({ email: req.body.email }).exec()

  if (!user) return res.status(404).json({ error: "User not found" })


  if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(404).json({ error: "Incorrect password" })

  return res.json({
    token: generateAccessToken(user)
  })
})

function generateAccessToken(user) {
  return jsonwebtoken.sign({
    name: user.name,
    id: user.id
  }, process.env.SECRET_KEY, { expiresIn: '1800s' });
}


module.exports = router