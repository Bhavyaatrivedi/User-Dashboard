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
   } = require('../controllers/authControllers');

const { checkUser } = require('../middlewares/authMiddleware');
const { updateOne } = require('../model/inputModel');


const router = require('express').Router();



router.post('/', checkUser);

router.post('/register', register);

router.post('/login', login);

router.post('/forget-password', forget_password);

router.post('/reset-password', reset_password);

router.post('/add-user', addUser);

router.post('/update-password', update_password);

router.delete('/delete-user/:id', deleteUser);

router.put('/edit-user/:id', editUser);
//router.use(requireAuth)
router.get('/get-user', get_user);

router.post("/upload",upload_file);
router.get("/files", get_files);
router.get("/files/:name", download);

//input filds
router.post('/add-field', add_field)
router.delete('/delete-field/:name', delete_field);
router.get('/get-fields', get_fields);
router.put('/update-fields', update_fields);

//company 
router.post('/add-company', addCompany);

module.exports = router;
