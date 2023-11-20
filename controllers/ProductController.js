import ProductService from "../serveces/ProductService";

class ProductController {
  static async all(req, res) {
    const {page, itemsPerPage, keyword} = req.query;
    try {
      const result = await ProductService.getProducts(
        page,
        itemsPerPage,
        keyword
      );
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }

  static async one(req, res) {
    const {id} = req.params;
    try {
      const result = await ProductService.getProduct(id);
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }

  static async add(req, res) {
    const {sku, name, price, count, visible, discountPercentage} = req.body;
    try {
      const result = await ProductService.addProduct(
        sku,
        name,
        price,
        count,
        visible,
        discountPercentage
      );
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
  static async edit(req, res) {
    const {sku, name, price, count, visible, discountPercentage} = req.body;
    const {id} = req.params;
    try {
      const result = await ProductService.editProduct(
        id,
        sku,
        name,
        price,
        count,
        visible,
        discountPercentage
      );
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
  static async delete(req, res) {
    const {id} = req.params;
    try {
      const result = await ProductService.deleteProduct(id);
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
  static async totalDiscount(req, res) {
    try {
      const result = await ProductService.totalDiscount();
      res.json({
        status: true,
        result,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: false,
        error: true,
        message: "System error",
      });
    }
  }
}

export default ProductController;
