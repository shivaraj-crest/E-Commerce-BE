const {getAllBrands,
    getProductsByBrand,
    addBrand,
    updateBrand,
    deleteBrand,
} = require('../controllers/brandController');
const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');
const Router = express.Router();


// Public Routes
Router.get("/",getAllBrands);

// Protected Routes
Router.use(authenticate);

Router.post("/add",authorizeRole('admin'),addBrand);
Router.put("/:id",authorizeRole('admin'),updateBrand);
Router.delete("/:id",authorizeRole('admin'),deleteBrand);

