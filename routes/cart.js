const {authenticate} = require('../middlewear/authMiddlewear');
const Router = express.Router();

Router.use(authenticate);

Router.post('/add',addProductToCart);
Router.get('/',getCartProducts);
Router.delete('/',deleteProductFromCart);


export default Router;