const jwt = require("jsonwebtoken");
const Admin = require("../../models/adminModel");

// Render the admin sign-in form
exports.getAdminSignIn = (req, res) => {
  res.render("./auth/admin/signin");
};

// Handle admin sign-in form submission
// Handle admin sign-in form submission
exports.postAdminSignIn = async (req, res) => {
    const { email, password } = req.body;
  
    // Hardcoded admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'Adm!n123';
  
    try {
      // Check if the provided email matches the hardcoded admin email
      if (email !== adminEmail) {
        req.flash('error', 'Invalid email or password');
        return res.status(401).redirect('/login-admin');
      }
  
      // Check if the provided password matches the hardcoded admin password
      if (password !== adminPassword) {
        req.flash('error', 'Invalid email or password');
        return res.status(401).redirect('/login-admin');
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { adminId: 'admin123', email: adminEmail },
        process.env.JWT_SECRET
      );
  
      // Store the token, ID, and email in the session
      req.session.token = token;
      req.session.adminId = 'admin123';
      req.session.email = adminEmail;
  
      // Redirect to the admin dashboard page
      res.redirect('/lecturer-dashboard');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { errorMessage: 'Server error' });
    }
  };
  