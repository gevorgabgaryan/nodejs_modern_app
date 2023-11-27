import passport from 'passport'

export const passportCheckAuthorization = (roles) => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return res.status(401).json({
          message: 'unauthorized'
        })
      }

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' })
      }

      if (!roles.includes(user.role)) {
        return res.status(401).json({ message: 'Access denied' })
      }

      req.user = user
      req.userId = user.id
      next()
    })(req, res)
  }
}
