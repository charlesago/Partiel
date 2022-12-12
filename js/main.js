const BaseUrl = "https://esdexamen.tk/b1devweb/api"

const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const registerPageButton = document.querySelector("#registerPage")
const loginPageButton = document.querySelector("#loginPage")
const mymodal = document.querySelector("#myModal")
const closeModal = document.querySelector(".close")
const editMe = document.querySelector('.edit')
let token

let currentuser

registerPageButton.addEventListener("click", displayRegisterPage)
messagesPageButton.addEventListener("click", displayPostPage)


function clearMainContainer(){
    mainContainer.innerHTML= ""
}

function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}

function getPostTemplate(post){

    let template
    if(post.user.username == currentuser){
        template = `  
                  
                 <div class="row justify-content-start mb-5">
                
                <div class="card col">
                  <h5 class="card-header">Author : ${post.user.username}</h5>
                  <div class="card-body bg-dark">
                    <p class="card-text text-light">${post.content}</p>
                    <p class="card-text text-light"> Commentaires : ${post.user.username} </p>
                    <a href="#" id="${post.id}" class=" editMsg btn btn-primary">Edit</a>
                    <button type="button" id="${post.id}" class=" delbutton  btn btn-secondary"><i class="bi bi-trash"></i>
                    
                  </div>
                </div>
                </div> `
    }
else{
        template =   `  <div class="row justify-content-start mb-5">

            <div class="card col">
                <h5 class="card-header">Author : ${post.user.username}</h5>
                <div class="card-body bg-dark">
                    <p class="card-text text-light">${post.content}</p>
                    
                    <p class="card-text text-light"> Commentaires : ${post.user.username} </p>
                    <a href="#" id="${post.id}" class="btn btn-primary">Commentaire</a>
                </div>
            </div>
        </div>`

    }


    return template




}

function getpostsTemplate(posts) {


        let postsTemplate = ""

    posts['hydra:member'].forEach(post=>{

        postsTemplate +=  getPostTemplate(post)
    })

        return postsTemplate


}

function closeModalRegister() {

    closeModal.addEventListener("click", ()=>{

        mymodal.style.display = "none"
        mymodal.close()
    })
}

function getRegisterTemplate(){
    let template = `
  <div class="contain contain-register ">
                <div class="register container d-flex row   ">
                            <div class="mb-4">
                        <h1>Register</h1>
                        
                            </div>
                        <input type="text" id="regUsername" class="form-control mb-3" placeholder="username">
                        <input type="password" id="regPassword" class="form-control mb-3" placeholder="password">
                        <button class="btn btn-primary mb-3 " id="register">Register</button>
            
                 </div>
                 </div>
                 </div>
    `
    return template
}

function getLoginTemplate(){
    let template = `   
    <div class="contain contain-register ">
                <div class="register container d-flex row  ">
                            <div class="mb-4">
                        <h1>Login </h1>
                        
                            </div>
                        <input type="text" id="usernameLogin" class="form-control mb-3" placeholder="Username">
                        <input type="password" id="passwordLogin" class="form-control mb-3" placeholder="Password">
                        <button class="btn btn-primary mb-3 " id="loginButton">Log In</button>
                        <span id="errorpassword" class="text-warning"></span>
                 </div>
                 </div>`

    return template
}

function getPostFieldTemplate(){
    let template = `
                
                <div class=" messageForm container contain-register mb-5 ">
                <button onClick="location.href=location.href" class="btn btn-secondary reloadBtn"> <i class="bi bi-arrow-clockwise"></i></button>
                <input type="text"  class="form-control " name="" id="messageField" placeholder="input message">
                <a class="btn btn-primary sendForm" id="sendMessage"><i class="bi bi-arrow-return-left"></i></a>
        </div>`


    return template
}

async function getMessagesFromApi(){

    let url = `${BaseUrl}/posts`

    let fetchParams = {
        method : 'GET',
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    }


    return await fetch(url, fetchParams)
        .then(response=>response.json())
        .then(messages=>{

            return messages

        })
    }

async function displayPostPage(){
    //consiste a afficher les messages + le champ d'entrée d'un nouveau message

        let messagesAndMessageField = ""

        getMessagesFromApi().then(posts=>{

            messagesAndMessageField+=getpostsTemplate(posts)
            messagesAndMessageField+=getPostFieldTemplate()

            display(messagesAndMessageField)


            const messageField = document.querySelector("#messageField")

            const sendButton = document.querySelector("#sendMessage")
            sendButton.addEventListener("click", sendMessage)


            const delbutton = document.querySelectorAll(".delbutton")
            delbutton.forEach( btn=>{

                btn.addEventListener("click" ,()=> {
                    let currentmessageid = btn.id
                    let url = `${BaseUrl}/posts/${currentmessageid}`

                    let fetchParams = {
                        method : "DELETE",
                        headers:{"Content-Type":"application/json",
                            "Authorization": `Bearer ${token}`
                        },

                    }


                    fetch(url, fetchParams)

                    displayPostPage()

                })
            })

            const editBtns = document.querySelectorAll('.editMsg')
            editBtns.forEach(btn=>{
                btn.addEventListener('click',()=>{
                    displayEditOrReplyArea("edit")
                    window.scrollBy(0,2000);
                    let currentMsg = btn.id
                    editMsg(currentMsg)

                })
            })

        })




}

function getEditorTemplate(type){
    let template
    if (type === "edit") {
        template =`
            <div class="editor messageForm container contain-register mb-5 ms-5">
                <input type="text" name="textEdit" class="form-control form-edit " id="textEdit" placeholder="Edit">
                <button id="editMsgButton" class="btnSend btn btn-primary ms-3">Send</button>
            </div>
        `
    }
    return template
}

function displayEditOrReplyArea(type){
    editMe.innerHTML = ""
    let template = getEditorTemplate(type)
    editMe.innerHTML = template

}

function editMsg(post){
    let currentEditBtn = document.querySelector('#editMsgButton')
    currentEditBtn.addEventListener('click', ()=>{
        let url = `${BaseUrl}/posts/${post}`
        let body = {
            content:document.querySelector('#textEdit').value
        }
        let bodySerialise = JSON.stringify(body)
        let fetchParams = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`

            },
            body: bodySerialise
        }
        fetch(url, fetchParams)
            displayPostPage()
        editMe.innerHTML = ""
    })
}

function displayLoginPage(){
    display(getLoginTemplate())
    //buttons conts & event listeners
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener("click", login)
}

function displayRegisterPage(){

    display(getRegisterTemplate())

    const regUsername = document.querySelector("#regUsername")
    const regPassword = document.querySelector("#regPassword")
    const regButton = document.querySelector("#register")

    regButton.addEventListener("click", ()=>{
        register(regUsername.value, regPassword.value)
    })

}

function register(){
    let url = `${BaseUrl}/registeruser`
    let body = {
        username : regUsername.value,
        password : regPassword.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=>{

            if(data == "username already taken"){

                mymodal.style.display = "block"
                closeModalRegister()
            }else{
                displayLoginPage()
            }
        })




}

function login(){
    let url = `${BaseUrl}/login_check`
    let body = {
        username : usernameLogin.value,
        password : passwordLogin.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        headers:{"Content-Type":"application/json"},
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())

        .then(data=> {


            if(data.token){
                token = data.token
                currentuser = usernameLogin.value
                document.querySelector(".btnRegisterSignup").innerHTML = `
                <p class="text-light ms-5">${usernameLogin.value}</p> 
                   <button class="btn text-light ms-4 " id="logout"> <i class="bi bi-box-arrow-in-right"></i>Log out</button>
               
                `
            displayPostPage()
            }else{
                displayLoginPage()
                errorpassword.innerHTML="ERROR username or password"

            }

        })
        .then(()=>{
            document.querySelector("#logout").addEventListener("click",()=>{
                token = null
                displayLoginPage()
                document.querySelector(".btnRegisterSignup").innerHTML =
                    `
                    <button class="btn text-light ms-4" id="registerPage"> <i class="bi bi-person-circle"></i>
                    Register</button>
                <button class="btn text-light ms-4 " id="loginPage"> <i class="bi bi-box-arrow-in-right"></i>
                    Log in</button>
                    
                    `
            })
        })




}

function sendMessage(){
    let url = `${BaseUrl}/post`
    let body = {
        content : messageField.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        headers:{"Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise

    }


    fetch(url, fetchParams)

    displayPostPage()
}

displayLoginPage()
