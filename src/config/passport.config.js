import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userService from '../dao/model/user.model.js'; // Ajusta la ruta según sea necesario
import cartService from '../dao/model/carts.model.js'; // Ajusta la ruta según sea necesario
import { createHash, isValidPassword } from '../utils.js'; // Ajusta la ruta según sea necesario

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: 'Iv23liYqSsWXOkwUk23R',
        clientSecret: '89e7a5d326802edd1666e19f34a5f6c73cd4a821',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },  async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 20,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userService.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))
;

    // Estrategia de registro local
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const existingUser = await userService.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'El email ya está en uso' });
            }
            const hashedPassword = createHash(password);
            const newUser = new userService({ first_name, last_name, email, age, password: hashedPassword });
            await newUser.save();

            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia de inicio de sesión local
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userService.findOne({ email }).populate('cart');
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            const isMatch = isValidPassword(user, password);
            if (!isMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })

};

export default initializePassport;
