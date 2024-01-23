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
    download_doc,
    generate_pdf,
    cbFuncapp,
    getSumOfUnitValue,
    getCompanyWithUsers,
    associateUsersWithEmails,
    exportUser,
    getLogs,
    generate_pdf_html,
   } = require('../controllers/authControllers');

const { checkUser } = require('../middlewares/authMiddleware');
const userImg = require('../middlewares/userImg')


const router = require('express').Router();


//user routes
router.post('/', checkUser);
router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forget_password);
router.post('/reset-password', reset_password);
router.post('/add-user', userImg.single('userImg'),addUser);
router.post('/update-password', update_password);
router.delete('/delete-user/:id', deleteUser);
router.put('/edit-user/:id', editUser);
router.get('/get-user', get_user);

//download document
router.get('/download-document/:id', download_doc)

//seTimeout()
router.get("/sum-unitValue",getSumOfUnitValue);
router.get("/user-info",cbFuncapp);


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

//lookup
router.post('/generate-users-company/:name', getCompanyWithUsers);
router.post('/associate-users-company/:name', associateUsersWithEmails);

router.post('/generate-pdf/:id', generate_pdf);
router.get("/downloadExcel/:id", exportUser);
router.get("/get-logs/:id", getLogs);

//generate-html-pdf
router.post('/generate-pdf-html', generate_pdf_html);

module.exports = router;
