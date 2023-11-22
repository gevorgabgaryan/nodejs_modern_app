import {Router} from "express";
import {
  validateGetProducts,
  validateAddProduct,
  validateParamsObjectId,
  validateEditProduct
} from "../middlewares/validation";
import ProductController from "../controllers/ProductController";
import {checkAuthorization} from "../middlewares/checkAuthorization";


const productRoutes = Router();

productRoutes.get("/", validateGetProducts, ProductController.all);
productRoutes.get("/get/:id", validateParamsObjectId, ProductController.one);
productRoutes.post(
  "/add",
  validateAddProduct,
  checkAuthorization(["admin", "editor"]),
  ProductController.add
);
productRoutes.put(
  "/edit/:id",
  validateEditProduct,
  checkAuthorization(["admin", "editor"]),
  ProductController.edit
);
productRoutes.delete(
  "/delete/:id",
  validateParamsObjectId,
  checkAuthorization(["admin", "editor"]),
  ProductController.delete
);
productRoutes.get(
  "/total-discount",
  checkAuthorization(["admin", "editor"]),
  ProductController.totalDiscount
);

export default productRoutes;
