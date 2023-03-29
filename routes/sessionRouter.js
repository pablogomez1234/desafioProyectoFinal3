const express = require('express')
const passport = require('passport')
require('../middlewares/auth')

const { Router } = express   
const sessionRouter = Router() 

const { users } = require('../class/userContainer')
const { logger, loggererr } = require('../log/logger')


/* ------------------ router session ----------------- */
//--------------------- usuario logeado?
sessionRouter.get('/', (req, res) => {
  if (req.session.passport) {
    //req.session.cookie._expires = new Date(Date.now() + 60000)
    //req.session.save()
    logger.info(`Usuario ${req.session.passport.user} logeado`)
    res.status(200).send({ user: req.session.passport.user })
  } else {
    logger.warn(`No hay usuario logeado`) 
    res.status(401).send({ user: '' })
  }
})


//--------------------- post login user
sessionRouter.post(
  '/login', 
  passport.authenticate('login'),
  function(req, res) {
    logger.info(`Autenticacion exitosa`)
    res.status(200).send({ message: 'Autenticación exitosa.' })
  }
)



//--------------------- post register user
sessionRouter.post(
  '/register',
  passport.authenticate('register'),
  (req, res) => {
    if ( users.addUser ({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      address: req.body.address,
      age: req.body.age,
      phone: req.body.phone,
      photo: req.body.photo
    })){
      logger.info(`Usuario creado correctamente`)
      res.status(200).send({ rlt: true, msg: 'Usuario creado correctamente'})
    } else {
      logger.warn(`No se ha podidi crear usuario`)
      res.status(401).send({ rlt: false, msg: 'Usuario no creado'})
    }
    
  }
)


//------------ get cerrar sesion
sessionRouter.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      loggererr.error(`No se ha podido cerrar la sesion, error: ${error}`)
      res.status(500).send(`Something terrible just happened!!!`)
    } else {
      logger.info(`Sesion cerrada.`)
      res.redirect('/')
    }
  })
})


module.exports = sessionRouter