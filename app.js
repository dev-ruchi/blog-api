const express = require('express')
const mongoose = require('mongoose')

const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
  .catch(function (e) {
    console.log('failed to connect to database', e)
  })

app.use(cors())

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)


app.listen(8000, function () {
  console.log('Listening on port 8000');
})
