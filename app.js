const express = require('express')
const yup = require('yup')

const app = express()


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

  return res.json(req.body)
})

app.listen(8000, function () {
  console.log('Listening on port 8000');
})
