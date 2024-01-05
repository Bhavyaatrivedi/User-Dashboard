const { register, 
    login, 
    addUser, 
    deleteUser, 
    update_password,
    get_user,
    forget_password,
    reset_password,
    upload_file,
    download,
    get_files,
    add_field,
    delete_field,
    get_fields,
    update_fields,
    editUser,
    addCompany,
    get_company,
    user_company,
    get_companyName,
   } = require('../controllers/authControllers');

const { checkUser } = require('../middlewares/authMiddleware');
const { updateOne } = require('../model/inputModel');


const router = require('express').Router();


//user routes
router.post('/', checkUser);
router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forget_password);
router.post('/reset-password', reset_password);
router.post('/add-user', addUser);
router.post('/update-password', update_password);
router.delete('/delete-user/:id', deleteUser);
router.put('/edit-user/:id', editUser);
router.get('/get-user', get_user);


//upload files routes
router.post("/upload",upload_file);
router.get("/files", get_files);
router.get("/files/:name", download);

//input fields routes
router.post('/add-field', add_field)
router.delete('/delete-field/:name', delete_field);
router.get('/get-fields', get_fields);
router.put('/update-fields', update_fields);

//company routes
router.post('/add-company', addCompany);
router.get("/get-company", get_company);


//one to many routes
router.get("/user-company/:id", user_company);
router.get('/user-company-name/:id', get_companyName);
module.exports = router;
