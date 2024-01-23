const User = require('../model/authModel');
const Parent = require('../model/parentSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const randomstring = require('randomstring');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const Jimp = require('jimp')

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
    const { email, password, mobileNo, address, name } = req.body;
    const user = await User.create({ email, password, mobileNo, address, name });
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


//download document
module.exports.download_doc = async(req, res) =>{
  const userId = req.params.id;
  console.log(userId)

  try{
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    const userInfo = {
      _id: user._id,
      email: user.email,
      mobileNo: user.mobileNo,
      address: user.address,
   
    };
    console.log(userInfo)
    res.status(200).json(userInfo);

  }catch(error){
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const { email, password, mobileNo, address, name, workExp, linkedinUrl, project, references, skill, education, objective } = req.body;
    const userImgPath = req.file ? req.file.path : null;

    // Extract the image name from the path
    const imageName = userImgPath ? path.basename(userImgPath) : null;

    

    console.log("userImgPath:", userImgPath);
    console.log("userImg:", imageName);

    const user = await User.create({
      email,
      password,
      mobileNo,
      address,
      name,
      workExp,
      linkedinUrl,
      project,
      references,
      skill,
      education,
      objective,
      userImg: imageName, // Store only the image name
    });
    // console.log(userImg)

    res.status(201).json({ user: user._id, created: true });
    console.log(user)
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
    const updatedFields = req.body; 
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

module.exports.getSumOfUnitValue = async (req, res) => {
  try {
    const aggregationResult = await Parent.aggregate([
      {
        $unwind: "$dealUnitChanges"
      },

      {
        $group: {
          _id: {
            trancheName: "$dealUnitChanges.trancheName",
            type: "$dealUnitChanges.type"
          },
          count: { $sum: 1 },
          totalUnitValue: { $sum: { $toInt: "$dealUnitChanges.unitValue" } },
          minUnitValue: { $min: { $toInt: "$dealUnitChanges.unitValue" } },
          maxUnitValue: { $max: { $toInt: "$dealUnitChanges.unitValue" } },
          avgUnitValue: { $avg: { $toInt: "$dealUnitChanges.unitValue" } }
        }
      }
    ]);

      // console.log(aggregationResult);
    if (aggregationResult.length > 0) {
      const totalUnitValue = aggregationResult;
      res.json({ totalUnitValue });
    } else {
      res.json({ totalUnitValue: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generateUsers = () => {
  const startTime = new Date(); 
  setTimeout(() => {
   
    const endTime = new Date(); 
    const elapsedTime = endTime - startTime; 

    console.log(`Function running after ${elapsedTime} milliseconds!`);
    return [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      ];  
  }, 2000);

  console.log("function users called");
};

const mainFunction = async (res, callback ) => {
  console.log("Inside mainFunction...");
  const startTime = new Date(); 
  //await new Promise((resolve) => {
    setTimeout(() => {
      const endTime = new Date(); 
      const elapsedTime = endTime - startTime; 
      console.log(`Function running after ${elapsedTime} milliseconds!`);
      callback("sent");
    }, 6000);
    console.log("main function called");
  //});
  
};

module.exports.cbFuncapp = async (req, res) => {
  try {

    await mainFunction(res, function( result ){
      const users = generateUsers();
    });
    
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// upload files
const uploadFilesMiddleware = require("../middlewares/upload");


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

const Company = require("../model/companyModel");
const { userInfo } = require('os');

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



const { promisify } = require('util');
const readFile = promisify(fs.readFile);
var ImageModule = require('docxtemplater-image-module-free');

module.exports.generate_pdf = async (req, res) => {
  const userId = req.params.id;


  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { email, mobileNo, address, userImg, linkedinUrl, workExp, skill, project, references, name, education, objective } = user;

    
    if (!userImg) {
      return res.status(400).json({ error: 'Invalid user image data' });
    }

    // console.log('dirname',path.resolve(`${__dirname}/../Images`));

    const getUerImage = path.resolve(`${__dirname}/../Images/${userImg}`)

    const imageOptions = {
      centered: false,
      getImage(tagValue, tagName) {
          console.log({ tagValue, tagName });
          return fs.readFileSync(tagValue);
      },
      getSize() {
          return [150, 150];
      },
  };

    const templateContent = await readFile('./sample1.docx', 'binary');
    const zip = new JSZip(templateContent);
    const doc = new Docxtemplater(zip,{
      modules: [new ImageModule(imageOptions)]
    });
    // doc.loadZip(zip);

    // Format user information
    const userData = {
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      address: user.address,
      linkedinUrl: user.linkedinUrl,
      workExp: replaceNewlines(user.workExp),
      skill: replaceNewlines(user.skill),
      project: replaceNewlines(user.project),
      references: replaceNewlines(user.references),
      education: replaceNewlines(user.education),
      objective: replaceNewlines(user.objective),
      userImg: getUerImage, // Pass contentType for rendering images
    };
    
    // Function to replace newline characters with Word document line breaks
   // Function to replace newline characters with Word document line breaks
function replaceNewlines(text) {
  return text.replace(/\n/g, '\n<w:br/>');
}


    doc.setData(userData);

    try {
      doc.render();
      console.log('Document rendered successfully');
    } catch (error) {
      console.error('Error during rendering:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const modifiedDocument = doc.getZip().generate({ type: 'nodebuffer' });
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=document.docx',
    });
    // console.log(modifiedDocument.toString('base64'));

    // const dataURL = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,`;
    // res.json({ dataURL, userData });
    // console.log(userData);
    res.end(modifiedDocument);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




//lookup
module.exports.getCompanyWithUsers = async (req, res) => {
  try {
    const name = req.params.name;

    const companyWithUsers = await Company.aggregate([
      {
        $match: { name: name }
      },
      {
        $lookup: {
          from: 'users',  
          localField: 'users',
          foreignField: '_id',
          as: 'usersData'
        }
      },
      {
        $project: {
          name: 1,
          usersData: 1,
          totalWorkExp: {
            $sum: {
              $map: {
                input: '$usersData',
                as: 'user',
                in: {
                  $convert: {
                    input: '$$user.workExp',
                    to: 'int',
                    onError: 0, 
                    onNull: 0  
                  }
                }
              }
            }
          }
        }
      }
    ]);

    if (companyWithUsers.length > 0) {
      res.json(companyWithUsers[0]);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports.associateUsersWithEmails = async (req, res) => {
  try {
    const name = req.params.name;
    const { email } = req.body;

    // Find the company by name
    const company = await Company.findOne({ name: name });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const users = await User.find({ email: { $in: email } });

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found with provided emails' });
    }

    
    company.users = users.map(user => user._id);
    await company.save();

    res.json({ message: 'Users associated with the company successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//generate excel sheet
const excelJS = require('exceljs');

module.exports.exportUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    worksheet.columns = [
      { header: "Name", key: "name", width: 10 },
      { header: "Email", key: "email", width: 10 },
      { header: "Address", key: "address", width: 10 },
      { header: "Education", key: "education", width: 10 },
    ];

    worksheet.addRow(user);

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const fileName = `user_${userId}.xlsx`;

    
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}



//array merge
const A = [
  {
    "group_id": "64116d0def7a130d48a0de5c",
    "documents": [
      {
        "document_id": "658ebd0feb708e470d367412",
        "group_id": "64116d0def7a130d48a0de5c",
        "docxFileName": "",
        "filename": "rtaf_investment_scheme_term_sheet_asklaser_i_(1)_radhika_malpani_291223_18_730.pdf",
        "name": "RTAF Investment Scheme Term Sheet AskLaser I (1)",
        "type": "pdf",
        "icon": "pdf.png",
        "upload_type": "address_proof",
        "manual_file_name": "",
        "date": {
          "$date": "2023-12-29T12:56:11.002Z"
        }
      }
    ]
  },
  {
    "group_id": "64116d24ef7a130d48a0de5e",
    "documents": [
      {
        "document_id": "658ec1fff31de667f38cd40d",
        "group_id": {
          "$oid": "64116d24ef7a130d48a0de5e"
        },
        "filename": "S389_Radhika_Malpani_PPM.pdf",
        "docxFileName": "S389_Radhika_Malpani_PPM.docx",
        "name": "PPM",
        "type": "pdf",
        "icon": "",
        "date": {
          "$date": "2023-12-29T12:56:31.761Z"
        }
      },
      {
        "document_id": "658ec204f31de667f38cd410",
        "group_id": {
          "$oid": "64116d24ef7a130d48a0de5e"
        },
        "filename": "Real_Time_Angel_Fund_Radhika_Malpani_Contribution_Agreement_291223_18_8048.pdf",
        "docxFileName": "Real_Time_Angel_Fund_Radhika_Malpani_Contribution_Agreement_291223_18_8048.docx",
        "name": "Contribution Agreement",
        "type": "pdf",
        "icon": "",
        "date": {
          "$date": "2023-12-29T12:56:36.564Z"
        }
      }
    ]
  }
]

const B = [{"group_id":"64116d24ef7a18830d48a0de5e3",
    "documents":[{"document_id":"6596aba577e8df4df09dbdcd","group_id":"64116d24ef7a18830d48a0de5e3",
    "docxFileName":"","filename":"testing_radhika_malpani_040124_18_2616.pdf","name":"Tetysting",
    "type":"pdf","icon":"pdf.png","upload_type":"client_master_report","manual_file_name":"",
    "date":"2020-01-04T12:59:17.037Y"}]}];

    function mergeDocuments(A, B) {

      for (const groupB of B) {
       
        const groupAIndex = A.findIndex(groupA => groupA.group_id === groupB.group_id);

        const formattedDocuments = (groupB.documents || []).map(document => ({
          document_id: document.document_id,
          group_id:  { "$oid": document.group_id  } ,
          filename: document.filename,
          docxFileName: document.docxFileName,
          name: document.name,
          type: document.type,
          icon: document.icon,
          date:  { "$date": document.date } 
        }));
        if (groupAIndex === -1) {
         
          console.log("not present");
          A.push(...formattedDocuments);

        } else {
          console.log("present");
    
          A[groupAIndex].documents = [
            ...(A[groupAIndex].documents || []),
            ...formattedDocuments
          ];
        }
      }
      
      console.log(JSON.stringify(A, null, 2));

      return A;
    }
    

    // const mergedArray = mergeDocuments(A, B);
    // console.log(mergedArray);
    

    //startup deals
    const Admin = require('../model/Admin');
    const StartupDeal = require('../model/StartupDeal');
    const Drive = require('../model/Drive');
    const mongoose = require('mongoose');
    
    module.exports.getLogs = async (req, res) => {
      const startupDealId = new mongoose.Types.ObjectId(req.params.id);
      console.log('Before $match:', startupDealId);
    
      try {
        const logsWithDriveAndAdminInfo = await StartupDeal.aggregate([
          {
            $match: { _id:  startupDealId  }
          },
          {
            $unwind: '$logs',
          },
          
          {
            $lookup: {
              from: 'drives',
              localField: 'logs.drive_ids',
              foreignField: '_id',
              as: 'driveInfo',
            },
          },
          {
            $lookup: {
              from: 'admins', 
              localField: 'logs.created_by',
              foreignField: '_id',
              as: 'createdByAdmin',
            },
          },
          {
            $lookup: {
              from: 'admins', 
              localField: 'logs.updated_by',
              foreignField: '_id',
              as: 'updatedByAdmin',
            },
          },
          {
            $lookup: {
              from: 'startup_deals', 
              localField: 'logs.task_ids',
              foreignField: 'checkListMaster.tasks.task_id',
              as: 'taskName',
            },
          },
         
          
          // {
          //   $project: {
          //     'logs.drive_name': '$driveInfo.name',
          //     'logs.task_name': '$taskName.checkListMaster.tasks.task_name',
          //     'logs.task_ids': 1,
          //     'logs.drive_ids': 1,
          //     'logs.document_date': 1,
          //     'logs.activity_type': 1,
          //     'logs.created_by': 1,
          //     'logs.updated_by': 1,
          //     'logs.created_date': 1,
          //     'logs.updated_date': 1,
          //     'logs._id': 1,
          //     'logs.type': 1,
          //     'logs.created_by_name': { $arrayElemAt: ['$createdByAdmin.name', 0] },
          //     'logs.updated_by_name': { $arrayElemAt: ['$updatedByAdmin.name', 0] },
          //   },
          // },
          {
            $group: {
              _id: '$_id',
              updatedByAdmin:{$first:"$updatedByAdmin.name"},
              drive_name:{$first:"$driveInfo.name"},
              task_name:{$first:"$checkListMaster"},
              //logs: { $push: '$logs' },
            },
          },
        ]);
        console.log('After $match:', logsWithDriveAndAdminInfo);
    
        if (!logsWithDriveAndAdminInfo || logsWithDriveAndAdminInfo.length === 0) {
          return res.status(404).json({ message: 'Startup deal not found' });
        }
    
        res.json({ logs: logsWithDriveAndAdminInfo });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };
    
    //html to pdf
  const puppeteer = require('puppeteer');

  const pdfDirectory = path.join(__dirname, 'pdfs');


if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory);
}


module.exports.generate_pdf_html = async (req, res) => {
  const { htmlContent } = req.body;
  
  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    const pdfFilename = `generated_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDirectory, pdfFilename);

    await fs.promises.writeFile(pdfPath, pdfBuffer);
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
