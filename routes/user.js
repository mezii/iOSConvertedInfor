const express = require('express')
router = express.Router();
const User = require("../database/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./auth');
var cookieParser = require('cookie-parser');

const JWT_SECRET = 'Huydeptrai@@123@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

router.get('/dashboard',auth,function(req,res){
  
  res.render('./dashboard')
})

router.post("/", async (req, res) => {
  const existedUser = await User.findOne({ email: req.body.email });
  if (existedUser) {
		return res.json({ status: 'error', error: 'Existed User' })
	}
  const { email, password } = req.body

	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!password || typeof password !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (password.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

  const user = {
    email: req.body.email,
    password: await bcrypt.hash(password, 10),
    isAuth: req.body.isAuth,
    isAdmin: req.body.isAdmin
  }
  await User.create(user);


  res.send(user);

})
router.post('/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}
	if (await bcrypt.compare(password, user.password)) {
		// the email, password combination is successful
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token , email: user.email})
	}

	res.json({ status: 'error', error: 'Invalid email/password' })
})

router.delete("/", async (req, res) => {
  const user = await User.deleteOne({ email: req.body.email });
  res.send(user)
})


router.get("/", async (req, res) => {
  res.send(await User.find({}));

})
router.get("/register", async(req,res) => {
  res.render("./register")
})
router.get("/login", async(req,res) => {
  res.render("./login")
})
router.put("/", async (req, res) => {

  const existedUser = await User.findOne({ email: req.body.email });
  const user = await User.updateOne({ email: req.body.email }, { password: existedUser.password, isAuth: req.body.isAuth, isAdmin: req.body.isAdmin ? true : false })
  res.send(user);
})

router.post('/auth', async (req, res) => {
    const {token} = req.body;
    if (!token) return res.status(401).send("No access token found");
    try {
        const decoded = jwt.verify(token,JWT_SECRET);

        if (decoded) res.render('./dashboard');
    } catch {
        res.status(400).send("Invalid token");
    }
})



module.exports = router;