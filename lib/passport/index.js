import passport from 'passport'
import passportJWT from 'passport-jwt'
import Config from '../../config'
import { Strategy as GitHubStrategy } from 'passport-github2'
import UserService from '../../serveces/UserService'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const SetupPassport = () => {
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: Config.JWTSecret
      },
      async (jwtPayload, done) => {
        const user = await UserService.findById(jwtPayload.userId)
        if (!user) {
          done(null, false)
        }
        if (user.status === 'new' || user.status === 'inactive') {
          done(null, false)
        }
        done(null, user)
      }
    )
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: Config.githubClientId,
        clientSecret: Config.githubClientSecret,
        scope: ['user:email'],
        callbackURL: 'http://localhost:3115/api/auth/github/callback',
        passReqToCallback: true,
        session: false
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const oauthProfile = {
            provider: profile.provider,
            profileId: profile.id,
            emails: profile.emails
          }

          req.oauthProfile = oauthProfile
          return done(null, true)
        } catch (e) {
          return done(e)
        }
      }
    )
  )

  return passport
}

export default SetupPassport
