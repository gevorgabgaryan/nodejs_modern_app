import AuthService from "../serveces/authService";

export const checkAuthorization = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers["Authorization"]
        ? req.headers["Authorization"]
        : req.headers["authorization"];
      if (!token || token.split(" ").length !== 2) {
        return res.json({
          code: 401,
          message: "unauthorized",
        });
      }
      const session = await AuthService.checkToken(token.split(" ")[1], roles);
      req.session = session;
      req.userId = session.userId;
      next();
    } catch (e) {
      console.log(e);
      res.json({
        message: "unauthorized",
      });
    }
  };
};
