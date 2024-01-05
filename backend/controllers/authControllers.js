const User = require('../model/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const randomstring = require('randomstring');
// const config = require('../config');

require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const API_KEY = process.env.SENDMAIL_API_KEY;
// console.log('apikey', API_KEY);
sgMail.setApiKey(API_KEY);


const sendMail = (name, email, token) => {
  return new Promise((resolve, reject) => {
    try {
      const msg = {
        to: email,
        from: 'shaishav.mahaseth@acumensa.co',
        subject: 'Reset your password',
        //html: '<p> Rest your password here ' + email + '</p>',
        html: '<p> Hi '+ name +', Copy the link  <a href="http://127.0.0.1:3000/reset-password?token='+token+'">and reset your password </a>',
      };
      sgMail
        .sendMultiple(msg)
        .then((msg) => {
          resolve(msg);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

const maxAge = 3 * 24 * 60 * 60;
// const createToken = (id) => {
//   return jwt.sign({ id }, ' super secret key', {
//     expiresIn: maxAge,
//   });
// };
const createToken = (id) => {
  console.log('Using secret key:', process.env.SECRET);
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
};


//error handling
const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  console.log(err);
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if (err.code === 11000) {
    errors.email = 'Email is already registered';
    return errors;
  }

  if (err.message.includes('Users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};


//hash the new password
const securePassword = async (password) => {
  try {
    const passHash = await bcrypt.hash(password, 10);
    return passHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//Register a user
module.exports.register = async (req, res, next) => {
  try {
    const { email, password, mobileNo, address } = req.body;
    const user = await User.create({ email, password, mobileNo, address });
    const token = createToken(user._id);

    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};


//Login a user
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, token: token, success: true });
  } catch (err) {
    const errors = handleErrors(err);
    // Use a 401 status code for unsuccessful login attempts
    res.status(401).json({ errors, success: false });
  }
};


//Forget password
module.exports.forget_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendMail(userData.name, userData.email, randomString);
      res.status(200).send({
        success: true,
        msg: 'Check your inbox and reset your password',
      });
    } else {
      res.status(200).send({ success: true, msg: 'This email does not exist' });
    }
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
};

//updating password
module.exports.update_password = async(req, res) =>{
  try {
    const { token, password } = req.body;

    // Check if the token is valid
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'Invalid or expired token' });
    }

   
    const hashedPassword = await securePassword(password);

    // Update the user's password and clear the token
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { password: hashedPassword, token: '' } },
      { new: true }
    );

    res.status(200).json({ success: true, msg: 'Password updated successfully', data: updatedUser });
  } catch (err) {
    consle.error('Error updating password:', err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
}


//checking password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    // console.log(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

//reset password


module.exports.reset_password = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    console.log('Received token:', token);
  
    const tokenData = await User.findOne({ token: token });
    console.log('User found in the database:', tokenData);
    //console.log(token, "DRK4TVCUQmsBtd5CxssTu2QGWl4HAwyeDRK4TVCUQmsBtd5CxssTu2QGWl4HAwyeDRK4TVCUQmsBtd5CxssTu2QGWl4HAwye");

    if (tokenData) {
      const newPassword = req.body.password;
      const confirmPassword = req.body.confirmPassword;
      console.log('Request Body:', req.body);
      console.log('New Password:', newPassword);
      console.log('Confirm Password:', confirmPassword);


      // Check if the new password and confirm password match
      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          success: false,
          msg: 'New password and confirm password do not match',
        });
      }

       const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

      const userData = await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: hashedPassword, token: '' } },
        { new: true }
      );

      return res.status(200).send({
        success: true,
        msg: 'User password has been reset',
        data: userData,
      });
    } else {
      return res.status(200).send({
        success: false,
        msg: 'Invalid or expired token. Could not reset password.',
      });
    }
  } catch (err) {
    console.error(err);  
    return res.status(400).send({ success: false, msg: err.message });
  }
};


//adding a user

module.exports.addUser = async (req, res) => {
  try {
    const { email, password, mobileNo, address } = req.body;
    const user = await User.create({ email, password, mobileNo, address });

    const token = createToken(user._id);

    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.error(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

//delete user
module.exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.status(200).json({ success: true, msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
};

//get user
module.exports.get_user= async(req, res) =>{
  const users = await User.find();
  res.json(users);
}

//edit user
module.exports.editUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedFields = req.body; // Assuming the request body contains the updated fields

    // Validate and update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.status(200).json({ success: true, msg: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
};



// upload files
const uploadFilesMiddleware = require("../middlewares/upload");
const fs = require("fs");

module.exports.upload_file = async (req, res) => {
  try {
    await uploadFilesMiddleware(req, res);

    if (req.files == undefined || req.files.length === 0) {
      return res.status(400).send({ message: "Please upload at least one file!" });
    }

    const fileNames = req.files.map(file => file.originalname);
    
    res.status(200).send({
      message: "Uploaded files successfully: " + fileNames.join(', '),
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the files. ${err}`,
    });
  }
};



//get files
module.exports.get_files = (req, res) => {
  const directoryPath = __basedir + "/uploads";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        // url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};


//download files

module.exports.download = (req, res) => {
  try {
    const fileName = req.params.name;
    const filePath = path.join(__basedir, '/uploads', fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({
        message: 'File not found.',
      });
    }

    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).send({
      message: 'Internal server error.',
    });
  }
};


//input fields
//name and value
const InputModel = require('../model/inputModel');


//delete fields
module.exports.delete_field = async (req, res) => {
  try {
    const { name } = req.params;

    const deletedItem = await InputModel.findOneAndDelete({ name });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json({ message: 'Item deleted successfully.', item: deletedItem });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

//edit button
module.exports.get_fields= async(req, res) =>{
  const data = await InputModel.find();
  res.json(data);
}

module.exports.add_field = async (req, res) => {
  try {
    const { fields } = req.body;

    if (!Array.isArray(fields) || fields.some(field => !field.name || !field.value)) {
      return res.status(400).json({ message: 'Invalid or missing fields in the request.' });
    }

    const itemsToInsert = [];

    for (const field of fields) {
      const { name, value } = field;
      itemsToInsert.push({ name, value });
    }

    const insertedItems = await InputModel.insertMany(itemsToInsert);
    console.log('Inserted items:', insertedItems);

    if (!insertedItems || insertedItems.length !== itemsToInsert.length) {
      console.error('Error inserting items:', insertedItems);
      return res.status(500).json({ message: 'Failed to insert items.' });
    }

    res.status(201).json({ message: 'Items added successfully.', items: insertedItems });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports.update_fields = async (req, res) => {
  try {
    const { fields } = req.body;

    if (!Array.isArray(fields) || fields.some(field => !field._id || !field.value)) {
      return res.status(400).json({ message: 'Invalid or missing fields in the request.' });
    }

    const updatedItems = [];
  
    // console.log('Fields before update:', fields);


    for (const field of fields) {
      const { _id , value } = field;
      // updatedItems.push({ _id, value });
      try {
      
        const updatedItem = await InputModel.findOneAndUpdate(
          {_id},
          { value },
          { new: true }
        );

        if (!updatedItem) {
          console.error(`Item with _id ${_id} not found.`);
        } else {
          console.log(`Updated item with _id ${_id}:`, updatedItem);
          updatedItems.push(updatedItem);
        }
      } catch (updateError) {
        console.error(`Error updating item with _id ${_id}:`, updateError.message);
      }
    }
    
      console.log('Fields after update:', fields);


      console.log('Updated items:', updatedItems);

    res.status(200).json({ message: 'Items updated successfully.', items: updatedItems });
  } catch (error) {
    console.error('Error processing update request:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


//company management

//add a company

const Company = require("../model/companyModel")

module.exports.addCompany = async(req, res) =>{
  try{
    const{name,email, aadhar, gst, pan, address} = req.body;

    const company = await Company.create({name,email, aadhar, gst, pan, address});

    const token = createToken(company._id);

    
    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: company._id, created: true });
  }catch(err){
    console.error(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
}

//get all companies
module.exports.get_company = async(req, res) =>{
  const data = await Company.find();
  res.json(data);
}

//many to one relationship

//get users of a company
module.exports.user_company = async (req, res) => {
  try {
    const company = await Company.findOne({ name: req.params.id }).populate('users'); 
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get company of user
module.exports.get_companyName = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('company');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const companyName = user.company ? user.company.name : 'Not associated with any company';
    res.json({ companyName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


