const express = require('express')
const mongoose = require('mongoose')
const yup = require('yup')
const User = require('./models/User')
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

  User.create(req.body)

  return res.json(req.body)
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

  return res.json(req.body)
})

app.listen(8000, function () {
  console.log('Listening on port 8000');
})
