const connectToDd = require('../DB/config/connectToMongo')
const { userModel } = require('../DB/model/mongoDbModel')

const bcrypt = require('bcrypt')
const saltRounds = 10

const { logger, loggererr } = require('../log/logger')



class Container { // MongoDB
  constructor( schema ) {
      this.schema = schema
  }
  

  async checkUser( username, password ) {
    try {
      await connectToDd()
      const documentInDb = await this.schema.find({ username: username })
      if ( documentInDb.length > 0 ) { //<-------------- Arreglar esto!!
        if ( bcrypt.compareSync( password, documentInDb[0].password ) ) {
          return { msg: '', result: true }
        } else {
          return { msg: 'Contrasena incorrecta', result: false }
        }
      } 
      return { msg: 'No existe usuario', result: false }
    } catch(err) {
      loggererr.error(`Error: ${err}`)
    }
  }


  async userInDb( username ){
    try {
      await connectToDd()
      const documentInDb = await this.schema.find({ username: username })
      if ( documentInDb.length > 0 ) { //<-------------- Arreglar esto!!
        return true
      } else {
        return false
      }
    } catch(err) {
      loggererr.error(`Error: ${err}`)
    }
  }
  

  async addUser( object ) {
    try{
      const encriptedPassword = bcrypt.hashSync(object.password, saltRounds)
      await connectToDd()
      const newUser = new userModel({
         username: object.username,
         password: encriptedPassword,
         name: object.name,
         address: object.address,
         age: object.age,
         phone: object.phone,
         photo: object.photo
         })
      await newUser.save()
        .then(user => console.log(`Se ha agregado a la base de datos elemento con id: ${user._id}`))
        .catch(err => console.log(err))
        return true
    } catch(err) {
      loggererr.error(`Error: ${err}`)
    }
  }

}


const users = new Container( userModel )

module.exports = { users } 