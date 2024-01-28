const {  validationResult } = require('express-validator');

const validationMiddlware = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  next(); // Log success before calling next middleware
};

module.exports = validationMiddlware;
