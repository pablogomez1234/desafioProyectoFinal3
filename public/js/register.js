function registerNewUser(sessionUserHtmlElement) {
  sessionUserHtmlElement.innerHTML = registerNewUserTemplate()

  const name = document.getElementById('name')
  const user = document.getElementById('email')
  const address = document.getElementById('address')
  const age = document.getElementById('age')
  const phoneInputField = document.querySelector("#phone")
  const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    })
  const userImage = document.getElementById('userImage')
  const urlImage = document.getElementById('urlImage')
  const password = document.getElementById('password')
  const passwordConf = document.getElementById('passwordConf')
  const registerBtn = document.getElementById('registerBtn')
  const cancelRegisterBtn = document.getElementById('cancelRegisterBtn')

  document.getElementById("registerBtn").addEventListener("click", ev => {

    const phoneNumber = phoneInput.getNumber() // paso a fromato internacional
    console.log(phoneNumber)

    if( !validateObject ({
          name: name.value,
          direccion: address.value,
          edad: age.value,
          telefono: phoneNumber,
          contrasena: password.value
        })
        & validateEmail( user.value )
        //& ( userImage || urlImage )
        & ( password.value === passwordConf.value )
        ){

        //<-------- aqui cargo el archivo al servidor
      
        fetch(`http://localhost:${location.port}/session/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: email.value,
            password: password.value,
            name: name.value,
            address: address.value,
            age: age.value,
            phone: phoneNumber,
            photo: urlImage.value
          })
        })
        .then(response => {
          if( response.status === 401 ){
            toast("Usuario ya existe", "#f75e25", "#ff4000")
          
          } else { // Usuario creado -> hago login
            fetch(`http://localhost:${location.port}/session/login/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: email.value,
                password: password.value
              })
            })
            .then( response => { 
              location.reload()
            })
            .catch(error => {
              console.log('Se produjo un error: ', error)
            })
          }
        })

    } else {
      toast('Verifique que completo todos los datos e ingreso correctamente su contrasena', "#f75e25", "#ff4000")
    }
  })

  document.getElementById("cancelRegisterBtn").addEventListener("click", ev => {
    location.reload()
  })

}
