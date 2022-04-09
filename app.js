const express = require('express')
const app = express()

app.use(express.json())

app.post('/sign-up', (req, res) => {
  res.json(req.body)
})

app.listen(8000, function () {
  console.log('Listening on port 8000');
})
