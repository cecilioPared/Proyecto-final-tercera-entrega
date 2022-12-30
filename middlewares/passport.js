import local_strategy from "passport-local"
import { isValidPassword } from '../utils/handleEncrypt.js'
import UsuariosController from '../controllers/usuarios.js'
import { encryptPassword } from '../utils/handleEncrypt.js'
import logger from '../utils/LoggerHandler.js'

const LocalStrategy = local_strategy.Strategy

const customFields = {
    usernameField: 'email',
    passwordField: 'password',
}

const verifyCallback = async (email, password, done) => {    

  await UsuariosController.obtenerPorCriterio({ email })    
      .then(user => {    
        if (!user) {
          return done(null, false)
        }

        if (!isValidPassword(password, user.password)) {           
          logger.warn(
            `Datos ingresados del usuario ${email} incorrectos.`
          );             
          return done(null, false)
        }
        done(null, user)
      })
      .catch(error => {      
        done(error)
      })
}

const registerCallback = async (req, email, password, done) => {
  
  await UsuariosController.obtenerPorCriterio({ email })    
  .then(async user => {    
    if (user) {
      logger.warn(
        `Usuario ${email} ya se encuentra registrado.`
      );
      return done(null, false)
    }

    req.body.avatar = `../img/avatar/${req.file.filename}`;

    const newUser = {
      ...req.body,
      password: encryptPassword(password),
    };

    return await UsuariosController.crear(newUser);   
  })
  .then((newUser) => {
    if (newUser) {
          logger.info(
                `Usuario ${newUser.email} registrado correctamente.`
          );

          done(null, newUser);
    } else {
          logger.warm(newUser);
          throw new Error('Usuario ya existe');
    }
})
  .catch(error => {      
    logger.error('Error en metodo sign-up', error.message);
    done(error)
  })
}

const authenticateUser = (passport) => {

    passport.use('sign-in',new LocalStrategy(customFields, verifyCallback))

    passport.use('sign-up',new LocalStrategy(customFields,registerCallback))

    
    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser( (_id, done) => UsuariosController.obtenerPorId(_id)
    .then( user => done(null, user))
    .catch( err => done(err))
    )
}
    
export default authenticateUser
