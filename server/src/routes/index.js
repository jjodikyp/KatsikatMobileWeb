const express = require('express');
const router = express.Router();
const orderDetailRoutes = require('./orderDetailRoute');
const authRoute = require('./authRoute');
const karyawanRoute = require('./karyawanRoute');

// Debug middleware khusus untuk order-details routes
router.use('/order-details', (req, res, next) => {
  console.log('Order Details Request:', {
    path: req.path,
    query: req.query,
    params: req.params
  });
  next();
});

router.use('/', authRoute);
router.use('/', orderDetailRoutes);
router.use('/', karyawanRoute);

module.exports = router;