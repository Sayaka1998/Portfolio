import XMLReq from "./XMLReq.js";
let xmlReq = new XMLReq("http://localhost/phpPractice/FinalProjectWebDev4/main.php");
const login = (resData) =>{
    resData = JSON.parse(resData);
    if(resData.sid) {
        sessionStorage.setItem("sid",resData.sid);
        sessionStorage.setItem("uid",JSON.stringify(resData.uid));
        sessionStorage.setItem("fname", JSON.stringify(resData.fname));
        sessionStorage.setItem("lname", JSON.stringify(resData.lname));
        sessionStorage.setItem("position", JSON.stringify(resData.position));
        location.replace("./main.html");
    } else {
        alert(resData);
    }
}

document.querySelector(".login-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    let reqData = new FormData(e.target);
    reqData.append("req","login");
    xmlReq.Post(reqData).then(
        login,
        (rej)=>alert(rej)
    )
})

document.querySelector(".reg-form").addEventListener("submit",(e)=>{
    e.preventDefault();
    let reqData = new FormData(e.target);
    reqData.append("req","register");
    xmlReq.Post(reqData).then(
        (res)=>alert(res),
        (rej)=>alert(rej)
    )
})

document.querySelector(".show-reg-form").addEventListener("click", () => {
    let regForm = document.querySelector(".div-reg-form");
    regForm.style.display = (regForm.style.display === "none" || regForm.style.display === "") ? "block" : "none";
})

document.querySelector(".back-login").addEventListener("click", () => {
    document.querySelector(".div-reg-form").style.display = "none";
})