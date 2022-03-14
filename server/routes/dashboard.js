const express = require('express');
const router = express.Router();

router.get('/', (res, req) => {
  res.status(200).send('Dashboard');
});

module.exports = router;
