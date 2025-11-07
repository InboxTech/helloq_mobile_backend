const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createCheckout = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: 'price_123', quantity: 1 }],
    mode: 'subscription',
    success_url: 'helloq://success',
    cancel_url: 'helloq://cancel',
  });
  res.json({ id: session.id });
};

module.exports = { createCheckout };