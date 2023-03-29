const sessionUserHtmlElement = document.querySelector('#sessionUser')
const productListHtmlElement = document.querySelector('#productList')
const registerFormHtmlElement = document.querySelector('#registerForm')

// SOCKET ----------------------------------------------------------------------------------------

const socket = io.connect()


//-------------------------------------------------------------------------------------------------
//--- SESSION
async function main(){
  const user = await userLogged() // Si hay usuario logeado devuelve el username --> session.js
  
  if ( user ) {
    logged( user ) // genero vistas de usaurio logueado --> session.js
  
  } else {
    sessionUserHtmlElement.innerHTML = loginTemplate()
    const logUser = document.getElementById("logUser")
    const logPassword = document.getElementById("logPassword")
   
    //--login con usuario y contrasena ------------------------------------
    document.getElementById("loginBtn").addEventListener("click", ev => { 
      if ( validateObject ({ a: logUser.value , b: logPassword.value })) {
        toast('Debe completar todos los datos', "#f75e25", "#ff4000")
      
      } else {    
        fetch(`http://localhost:${location.port}/session/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: logUser.value,
            password: logPassword.value
          })
        })
        .then(response => {
          if( response.status === 401 ){
            toast("Usuario y/o contrasena incorrectos", "#f75e25", "#ff4000")
          } else {
            logged ( logUser.value )
          }
        })
        .catch(error => {
          console.error('Se produjo un error: ', error)
        })
      }
    })
    
    //--registro de usuario ---------------------
    document.getElementById("registerBtn").addEventListener("click", ev => {
      registerNewUser(sessionUserHtmlElement) // --> register.js
    }) 

  }
}


//-------------------------------------------------------------------------------------------------
//--- PRODUCTOS

socket.on('productos', data => {
    document.querySelector('#tabla').innerHTML = productsTable( data )
})



//-----------------------------------------------------------------

main()