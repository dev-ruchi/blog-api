const express = require("express");
const router = express.Router();

const yup = require('yup');
const auth = require("../middlewares/auth");

const Post = require('./../models/Posts')



router.post('/', auth, async (req, res) => {
  try {
    await yup.object({
      title: yup.string().required(),
      body: yup.string().required()
    })
      .validate(req.body)
  } catch (e) {
    return res.json(e.errors)
  }

  if (await Post.exists({ title: req.body.title }).exec()) {
    return res.status(406).json({ error: 'Title already exists' })
  }

  const post = await Post.create({
    ...req.body,
    slug: req.body.title.toLowerCase().replaceAll(' ', '-'),
    user: req.user.id
  })

  return res.status(201).json(post)

})

router.get('/', async (req, res) => {
  return res.json(await Post.find().exec())
})

router.get('/:slug', async (req, res) => {
  return res.json(await Post.findOne({ slug: req.params.slug }).populate('user', 'name').exec())
})

router.put('/:id', auth, async (req, res) => {
  try {
    await yup.object({
      title: yup.string(),
      user: yup.string(),
      body: yup.string()
    })
      .validate(req.body)
  } catch (e) {
    return res.json(e.errors)
  }

  const post = await Post.findById(req.params.id).exec()

  if (post.user !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to update this post"
    })
  }

  await Post.findByIdAndUpdate(req.params.id, req.body).exec()
  return res.status(200).json({
    message: "Post updated successfully"
  })
})

router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id).exec()

  if (post.user !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to delete this post"
    })
  }

  await Post.findByIdAndDelete(req.params.id).exec()

  return res.status(204).send()
})

module.exports = router