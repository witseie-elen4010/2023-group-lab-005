const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    default: 'admin@gmail.com'
  },
  password: {
    type: String,
    required: true,
    default: 'Adm!n123'
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
