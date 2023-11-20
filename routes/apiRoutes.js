import {Router} from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/products", productRoutes);

export default apiRoutes;
