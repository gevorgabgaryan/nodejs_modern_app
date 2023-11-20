import {Router} from "express";
import {
  validateGetProducts,
  validateAddProduct,
  validateProductObjectId,
  validateEditProduct
} from "../middlewares/validation";
import ProductController from "../controllers/ProductController";
import {passportCheckAuthorization} from "../middlewares/passportCheckAuthorization";

const productRoutes = Router();

productRoutes.get("/", validateGetProducts, ProductController.all);
productRoutes.get("/get/:id", validateProductObjectId, ProductController.one);
productRoutes.post(
  "/add",
  validateAddProduct,
  passportCheckAuthorization(["admin", "editor"]),
  ProductController.add
);
productRoutes.put(
  "/edit/:id",
  validateEditProduct,
  passportCheckAuthorization(["admin", "editor"]),
  ProductController.edit
);
productRoutes.delete(
  "/delete/:id",
  validateProductObjectId,
  passportCheckAuthorization(["admin", "editor"]),
  ProductController.delete
);
productRoutes.get(
  "/total-discount",
  passportCheckAuthorization(["admin", "editor"]),
  ProductController.totalDiscount
);

export default productRoutes;
