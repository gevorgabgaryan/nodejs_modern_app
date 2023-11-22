import {Router} from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import basketRoutes from "./basketRoutes";

const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/products", productRoutes);
apiRoutes.use('/baskets', basketRoutes);

export default apiRoutes;
