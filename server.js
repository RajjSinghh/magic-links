const dotenv = require("dotenv")
const express = require('express');
const path = require('path');
const jwt = require("jsonwebtoken");
const {sendMagicLink } = require("./mailer")

const app = express();
const port = 8080;

app.use(require('body-parser').urlencoded());

dotenv.config();

// Emulates a database of users, should be replaced with an actual database
const USERS = [
	{
		id: 1,
		email: "gurrajsingh22@gmail.com",
		name: "Raj"
	}
]

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/login', async (req, res) => {
	// simulating a database query
	const user = USERS.find(u => u.email === req.body.email);

	if (user !== null) {
		try {
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
				expiresIn: "1h",
				})
			await sendMagicLink({ email: user.email, token })
		} catch (e) {
			console.log(e);
			return res.send("Error logging in, please try again");
			}
	}

	res.send("Check Your email to finish logging in");
})

app.get("/verify", (req, res) => {
	const token = req.query.token;
	if (token === null)
		return res.sendStatus(401);
	
	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const user = USERS.find(u => u.id === decodedToken.userId);

		res.send(`authed as ${user.name}`);
	} catch (e) {
		res.sendStatus(410);
	}
})


app.listen(port, () => {
	console.log(`Listening on ${port}`);
})
