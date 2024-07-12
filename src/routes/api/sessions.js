import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../../dao/model/user.model.js';
import {crateHash, isValidPassword} from '../../utils.js'

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const hashedPassword = crateHash(password);
    const user = new User({ first_name, last_name, email, age, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).send('Error en el registro de usuario');
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Datos incompletos' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
  
      if (!isValidPassword(user.password, password)) {
        return res.status(403).send({ status: "error", error: "Password incorrecto" });
      }
  
      req.session.userId = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
      };
  
      res.redirect('/products');
    } catch (error) {
      console.error('Error en el login de usuario:', error);
      res.status(500).send('Error en el login de usuario');
    }
  });

// Logout de usuario
router.post('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/profile');
      }
      res.clearCookie('sid');
      res.redirect('/login');
    });
  } catch (error) {
    console.error('Error en el logout de usuario:', error);
    res.status(500).send('Error en el logout de usuario');
  }
});

export default router;
