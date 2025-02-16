const {User} = require('../models');


const checkDuplicateFields = async (req, res, next) => {
  // Access form-data fields directly
  const email = req.body.email;
  const mobile = req.body.mobile;

  // Add validation for required fields
  if (!email || !mobile) {
    return res.status(400).json({ message: 'Email and mobile are required' });
  }

  try {
    // Check if email exists
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Check if mobile exists
    const mobileExists = await User.findOne({ where: { mobile } });
    if (mobileExists) {
      return res.status(400).json({ message: 'Mobile number is already in use' });
    }

    // If no duplicates found, proceed to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error validating fields', error: error.message });
  }
};

module.exports = checkDuplicateFields;
