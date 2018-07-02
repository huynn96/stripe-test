const express = require('express');
const bodyParser = require('body-parser');
const stripe = require("stripe")('sk_test_N65dLunNo7MpkbkZylsOW7lI');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.raw({type: '*/*'}));

const amount = 10000;
const monthlyPlan = 'plan_D4NS6lEFYJPcE5';
const yearPlan = 'plan_D4l04ELIRwVXtJ';
const endpointSecret = 'whsec_SoEc8oRrB8Xsou9WSAswwHDu3ZvDDXgV';
var port = process.env.PORT || 8080;
app.post('/payment', (req, res) => {
	console.log(req.body.stripeToken);
	// stripe.charges.create({
 //  		amount: parseInt(req.body.amount),
 //  		description: "Test Payment Single",
 //     	currency: "usd",
 //     	source: req.body.stripeToken
	// })
	// .then(charge => {
	// 	console.log(charge);
	// });
	res.send('success');
})

app.post('/stripe/webhook', (req, res) => {
	let sig = req.headers["stripe-signature"];
	console.log(req.body);
	console.log(sig);
	try {
		let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
		console.log(event);
	}
	catch (err) {
		console.log(err);
		res.status(400).end()
	}

	res.json({received: true});
})

app.post('/premium', (req, res) => {
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
	}).then(customer => {
		console.log(customer);
		return stripe.subscriptions.create({
			customer: customer.id,
			items: [{plan: req.body.typePremium === 'month' ? monthlyPlan : yearPlan }],
		});
	}).then(charge => console.log(charge))
})

app.get('/', (req, res) => {
	res.send(log);
})

app.listen(port, () => {
	console.log(`Listen on port ${port}`);
})