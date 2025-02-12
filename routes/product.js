const {authenticate,authorizeRole} = require('../middlewear/authMiddlewear');
const Router = express.Router();

Router.use(authenticate);

Router.get('/',getAllProducts)
Router.get('/:id',getProductById)


Router.get('/create',authorizeRole('admin'),upload.array("images",5),addProduct)
Router.put('/edit',authorizeRole('admin'),updateProduct)
Router.delete('/',authorizeRole('admin'),deleteProduct)

export default Router


