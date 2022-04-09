const express = require('express')
const mongoose = require('mongoose')
const yup = require('yup')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const { compareSync } = require('bcrypt')
require('dotenv').config()

const app = express()

mongoose.connect(process.env.MONGODB_URI)
.catch (function(e) {
   console.log('failed to connect to database', e)
})  
app.use(express.json())

app.post('/sign-up', async (req, res) => {
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

  User.create(userData)

  return res.json(userData)
})

app.post('/log-in', async (req, res) => {
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

  return res.json(user)
})

app.listen(8000, function () {
  console.log('Listening on port 8000');
})
