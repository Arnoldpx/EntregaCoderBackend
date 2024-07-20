import { Router } from 'express';
import passport from 'passport';
import Cart from '../../dao/model/carts.model.js';
import User from '../../dao/model/user.model.js';

const router = Router();

// Registro
router.post('/register', passport.authenticate('register', {
  failureRedirect: '/api/sessions/failregister'
}), async (req, res) => {
  try {
      // Guardar el usuario en la sesión si es necesario
      req.session.user = {
          _id: req.user._id,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          email: req.user.email,
          age: req.user.age,
          cart: req.user.cart
      };

      res.redirect('/login');
  } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).send('Error al registrar el usuario');
  }
});

router.get('/failregister', (req, res) => {
    console.log("Registro fallido");
    res.send({ error: "fallo" });
});

router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})


router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/")
})


// Inicio de sesión
router.post('/login', passport.authenticate("login", { failureRedirect: '/api/sessions/faillogin' }), (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos Incorrectos" });

   
    req.session.user = {
        _id: req.user._id, 
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart 
    };

    res.redirect('/products');
});

router.get('/cart', (req, res) => {
    if (!req.session.user || !req.session.user.cart) {
        return res.status(404).json({ error: 'Carrito no encontrado en la sesión' });
    }
    res.json({ cart: req.session.user.cart });
});

router.get('/faillogin', (req, res) => {
    console.log("Inicio de sesión fallido");
    res.send({ error: "fallo" });
});

// Obtener la sesión actual del usuario
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(404).json({ error: 'No hay usuario en sesión' });
    }
});

// Cierre de sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});
export default router;
