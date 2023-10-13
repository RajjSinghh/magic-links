const nodemailer = require("nodemailer");

function sendMagicLink ( { email, token }) {
	// TODO add code to send email to email with the body:
	console.log(
	`<a href="http://localhost:8080/verify?token=${token}">Log in now</a>`
	);
}

module.exports = {
	sendMagicLink
}
