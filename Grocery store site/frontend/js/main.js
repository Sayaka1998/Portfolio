import XMLReq from "./XMLReq.js";
import Product from "../classes/productClass.js";
import Cart from "../classes/cartClass.js";
import Item from "../classes/itemClass.js";
let xmlReq = new XMLReq("http://localhost/phpPractice/FinalProjectWebDev4/main.php");

const productList = [];
let itemCollection = [];
let sum = 0;

// click the delete employee button, show a form 
document.querySelector(".delEmp-btn").addEventListener("click", () => {
    let delEmp = document.querySelector(".div-delEmp");
    delEmp.style.display = (delEmp.style.display === "none" || delEmp.style.display === "") ? "block" : "none";
    if(document.querySelector(".order-history").style.display === "block") {
        showOH();
    }
    if(document.querySelector(".div-cart").style.display === "table") {
        document.querySelector(".div-cart").style.display = "none"; 
    }
    if(document.querySelector(".addpr").style.display === "block") {
        document.querySelector(".addpr").style.display = "none";
    }
})

// delete employee data 
document.querySelector(".delEmp-form").addEventListener("submit", (e)=> {
    e.preventDefault();
    const confirmed = confirm("Are you sure you want to permanently delete this employee data ?");
    if(confirmed) {
        let reqData = new FormData(e.target);
        reqData.append("req","delEmp");
        xmlReq.Post(reqData).then(
            res=>alert(res),
            rej=>alert(rej)
        )
    } else {
        alert("Deletion canceled.");
    }
})

// when user add products, change amount, or delete products, store itemCollection in local storage
const storeLS = () =>{
    // the list of the contents in a cart to add to local storage
    const cartContents = [];
    // creat objects that also include a total property 
    for(let item of itemCollection) {
        let itemObj = new Item(item.pid, item.pname, item.price, item.pimg, item.amount, item.total());
        cartContents.push(itemObj);
    }
    // store the list in local storage
    localStorage.setItem("cart", JSON.stringify(cartContents));
}

// remove a product from a cart
const deleteHandler = (e) => {
    let id = e.target.parentElement.parentElement.children[0].innerText; // = pid
    for(let idx in itemCollection) {
        // if the products which has the pid exist in a cart list(itemCollection), remove it
        if(id == itemCollection[idx].pid) {
            itemCollection.splice(idx,1);
            sum = 0;
            // calculate the total of all products in a cart again 
            for(let item of itemCollection) {
                sum += parseFloat(item.total());
            }
            document.querySelectorAll("tfoot")[0].children[0].children[1].innerText = "$" + parseFloat(sum).toFixed(2);
        }
    }
    // remove the row from the cart
    e.target.parentElement.parentElement.remove();
    // store new cart list in local storage
    storeLS();
}

// create a cart
const cartGen = () => {
    // reset a cart to create new table in a cart
    document.querySelector(".cart").children[1].innerHTML = "";
    for(let item of itemCollection) {
        let tr = item.Tr(); // Cart.Tr()
        let total = item.total(); // Cart.total()
        // when user change the amount of products,total also change
        tr.children[3].addEventListener("change", () => {
            sum += parseFloat(item.total() - total); // new total - previous total
            total = item.total(); // total = new total
            document.querySelectorAll("tfoot")[0].children[0].children[1].innerText = "$" + parseFloat(sum).toFixed(2);
            // store new cart list in local storage
            storeLS();
        })
        // delete button, remove the row of the clicked product
        tr.children[5].children[0].addEventListener("click",deleteHandler);
        // calculate the total of all products in a cart
        sum += parseFloat(item.total());
        document.querySelector(".cart").children[1].append(tr); //document.querySelector(".cart").children[1] = tbody
    }
    document.querySelectorAll("tfoot")[0].children[0].children[1].innerText = "$" + parseFloat(sum).toFixed(2);
    // store a cart list in local storage
    storeLS();
}

// create card 
const cardGen = ()=>{
    let flag = false; // to check if a added product exist in a cart
    let row = document.querySelector(".products-cards");
    for(let pr of productList){
        let col = document.createElement("div");
        col.className = "col";
        let card = document.createElement("div");
        card.classList.add("card");
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        let prName = document.createElement("h4");
        prName.classList.add("card-title");
        prName.innerText = pr.pname;
        let prIdPr = document.createElement("p");
        prIdPr.classList.add("card-text");
        prIdPr.innerText = `Code: ${pr.pid} - Price: $${pr.price}`;
        let prImgDiv = document.createElement("div");
        prImgDiv.classList.add("product-img-div");
        let prImg = document.createElement("img");
        prImg.classList.add("card-img");
        prImg.src = pr.pimg;
        prImg.alt = pr.pname;
        prImgDiv.append(prImg)
        let addBt = document.createElement("button");
        addBt.className = "add-cart-btn btn btn-outline-success";
        addBt.innerText = "Add";
        // click a add button, add the product in a cart
        addBt.addEventListener("click",() => {
            let tmpValues = Object.values(pr); // tmpValues = [1001(pid), "tomato"(pname), 2.53(price)]
            for(let idx in itemCollection) { // take the index of the itemCollection
                // if the added product already exist in a cart, amount increase by 1
                if(tmpValues[0] == itemCollection[idx].pid) { // pid of the added product = pid in the itemCollection
                    let tmpObj = itemCollection[idx];
                    tmpObj.amount++;
                    itemCollection[idx] = tmpObj;
                    flag = true;
                }
            }
            // if new product is added to a cart, create a Cart object and add it to the list of a cart(itemCollection)
            if(!flag) {
                let itemObj = new Cart(tmpValues[0], tmpValues[1], tmpValues[2], tmpValues[3]);
                itemCollection.push(itemObj);
            }
            // create a cart
            cartGen();
        });

        // click the delete button, remove the product from the database
        let delBt = document.createElement("div");
        delBt.classList.add("delPrDb");
        let p = document.createElement("p");
        p.innerText = "+";
        delBt.append(p);
        let posi = JSON.parse(sessionStorage.getItem("position"));
        posi == "Admin" ? delBt.style.display = "block" : delBt.style.display = "none";
        delBt.addEventListener("click", (e) => {
            const confirmed = confirm("Are you sure you want to permanently delete this product ?");
            if(confirmed) {
                let reqData = new FormData();
                reqData.append("req","delpr");
                reqData.append("pid", pr.pid);
                xmlReq.Post(reqData).then(
                    (res)=>{
                        alert(res);
                        e.target.parentElement.parentElement.parentElement.remove();
                    },
                    (rej)=>console.log(rej)
                )
            } else {
                alert("Deletion canceled");
            }

        })

        cardBody.append(prName,prIdPr,prImgDiv,addBt,delBt);
        card.append(cardBody);
        col.append(card);
        row.append(col);
    }
    // if some products are in a cart, creat a table of the cart
    if(localStorage.getItem("cart")) {
        let prevCartItems = JSON.parse(localStorage.getItem("cart"));
        for(let item of prevCartItems) {
            let itemObj = new Cart(item.pid, item.pname, item.price, item.pimg, item.amount);
            itemCollection.push(itemObj);
        } 
        cartGen();
    }
}

// generate pruducts objects from a data from the back end
const productGen = (data) => {
    data = JSON.parse(data);
    for(let pr of data) {
        let productObj = new Product(pr.pid,pr.pname, pr.price, pr.pimg);
        productList.push(productObj);
    }
    cardGen();
}

// load the products data from the back end
const load = () => {
    if(sessionStorage.getItem("sid") != undefined) {
        let fname = JSON.parse(sessionStorage.getItem("fname"));
        let lname = JSON.parse(sessionStorage.getItem("lname"));
        let posi = JSON.parse(sessionStorage.getItem("position"));
        document.querySelector("h4").innerText += " " + fname + " " + lname + ", " + posi;
        if(posi === "Admin") {
            document.querySelector(".showform-btn").style.display = "block";
            document.querySelector(".delEmp-btn").style.display = "block"; 
        } else if (posi == "Staff") {
            document.querySelector(".showform-btn").style.display = "none";
            document.querySelector(".delEmp-btn").style.display = "none"; 
        }
        let sid = sessionStorage.getItem("sid");
        let reqData = new FormData();
        reqData.append("req", "load");
        reqData.append("uid", JSON.parse(sessionStorage.getItem("uid")));
        reqData.append("sid", sid);
        xmlReq.Post(reqData).then(
        productGen,(rej) => {alert(rej)}
        )
    } else {
        location.replace("./login.html");
    }
}
load();

// click the show button, show the order history
const showOH = () => {
    let ohDiv = document.querySelector(".order-history");
    ohDiv.style.display = (ohDiv.style.display === "none" || ohDiv.style.display === "") ? "block" : "none";
} 

// click + button, show the form to add the data of new products
document.querySelector(".showform-btn").addEventListener("click",() => {
    let addpr = document.querySelector(".addpr");
    addpr.style.display = (addpr.style.display === "none" || addpr.style.display === "") ? "block" : "none";
    if(document.querySelector(".order-history").style.display === "block") {
        showOH();
    }
    if(document.querySelector(".div-cart").style.display === "table") {
        document.querySelector(".div-cart").style.display = "none"; 
    }
    if(document.querySelector(".div-delEmp").style.display === "block") {
        document.querySelector(".div-delEmp").style.display = "none"; 
    }
})

// click the add new products button, add the data of new products to the database
document.querySelector(".addnewpr-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let reqData = new FormData(e.target);
    reqData.append("req", "addpr");
    xmlReq.Post(reqData).then(
        (res)=>{
            alert(res);
            location.reload();
        },
        (rej)=>console.log(rej)
    )
})

// click the cart button, show the cart
document.querySelector(".cart-btn").addEventListener("click", () => {
    let cart = document.querySelector(".div-cart");
    cart.style.display = (cart.style.display === "none" || cart.style.display === "") ? "table" : "none";
    if(document.querySelector(".order-history").style.display === "block") {
        showOH();
    }
    if(document.querySelector(".addpr").style.display === "block") {
        document.querySelector(".addpr").style.display = "none";
    }
    if(document.querySelector(".div-delEmp").style.display === "block") {
        document.querySelector(".div-delEmp").style.display = "none"; 
    }
})


// click the buy button, the list of items in a cart send to the backend and store in a data base
document.querySelector(".buy-btn").addEventListener("click", () => {
    let boughtItems = JSON.parse(localStorage.getItem("cart")) || [];
    if(boughtItems.length === 0) {
        alert("There is no products in your cart.");
    } else {

        // get the ordered date 
        let day = new Date();
        let y = String(day.getFullYear());
        let m = String(day.getMonth() + 1);
        let d = String(day.getDate());
        let today = m + d + y;

        let reqData = new FormData();
        reqData.append("req", "buy");
        reqData.append("item", JSON.stringify(boughtItems));
        reqData.append("today", today);

        // call the XMLReq function, and send the list of bought products
        xmlReq.Post(reqData).then(
            (res)=>alert(res),
            (rej)=>console.log(rej)
        );

        // remove the table of the bought products from the cart
        itemCollection = [];
        cartGen();
        document.querySelectorAll("tfoot")[0].children[0].children[1].innerText = "$0.00";
        // delete the list in a cart from local storage
        localStorage.removeItem("cart");
    }
})

// create a order history
const orderHistory = (data) => {
    data = JSON.parse(data);
    let ohDiv = document.querySelector(".order-history");
    ohDiv.innerHTML = "";
    let idx = 0; // use as id of the attributes of the accordion button
    // create a accordion for each table
    for(let tbname in data) {
        // create a header of a accordion, and set the table name as header
        let accDiv = document.createElement("div");
        accDiv.classList.add("accordion");
        let accItDiv = document.createElement("div");
        accItDiv.classList.add("accordion-item");
        let h2 = document.createElement("h2");
        h2.classList.add("accordion-header");
        let accBtn = document.createElement("button");
        accBtn.className = "accordion-button collapsed";
        accBtn.type = "button";
        accBtn.setAttribute("data-bs-toggle","collapse");
        accBtn.setAttribute("data-bs-target","#collapse" + idx);
        accBtn.setAttribute("aria-expanded", "false"); 
        accBtn.setAttribute("aria-controls","collapse" + idx);
        //the header title is mm/dd/yyyy
        let tableName = tbname.replace("_orderhistory",""); // = 12132023(mmddyyyy)
        let m = tableName.slice(0,2); // 12(mm)
        let d = tableName.slice(2,4); // 13(dd)
        let y = tableName.slice(4,8); // 2023(yyyy)
        accBtn.innerText = m + "/" + d + "/" + y;
        h2.append(accBtn);

        // create a table of the data from the database
        let colDiv = document.createElement("div");
        colDiv.id = "collapse" + idx;
        colDiv.className = "accordion-collapse collapse";
        colDiv.setAttribute("aria-labelledby","headingOne");
        colDiv.setAttribute("data-bs-parent","#accordionExample");
        colDiv.setAttribute("aria-expanded", "false");
        let bdDiv = document.createElement("div");
        bdDiv.classList.add("accordion-body");

        // table
        let table = document.createElement("table");
        table.classList.add("table");

        // thead
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let idTd = document.createElement("td");
        idTd.innerText = "Product ID";
        let nmTd = document.createElement("td");
        nmTd.innerText = "Product Name";
        let prTd = document.createElement("td");
        prTd.innerText = "Price";
        let amTd = document.createElement("td");
        amTd.innerText = "Amount";
        let ttTd = document.createElement("td");
        ttTd.innerText = "Total";
        tr.append(idTd,nmTd,prTd,amTd,ttTd);
        thead.append(tr);

        // tbody
        let tbody = document.createElement("tbody");
        let sum = 0;
        for(let item of data[tbname]) {
            let tr = document.createElement("tr");
            for(let index in Object.values(item)) {
                if(index != 3) { // 3 = pimg(path of image)
                    if(index == 2) {// 2 = price
                        let td = document.createElement("td");
                        td.innerText = "$" + Object.values(item)[index];
                        tr.append(td);
                    } else if(index == 5) { // 5 = total
                        let td = document.createElement("td");
                        td.innerText = "$" + Object.values(item)[index];
                        tr.append(td);
                        sum += parseFloat(Object.values(item)[index]);
                    } else {
                        let td = document.createElement("td");
                        td.innerText = Object.values(item)[index];
                        tr.append(td);
                    }
                }
            }
            tbody.append(tr);
        }
        
        // tfoot
        let tfoot = document.createElement("tfoot");
        let tfoorTr = document.createElement("tr");
        let ttTxTd = document.createElement("td");
        ttTxTd.colSpan = 4;
        ttTxTd.innerText = "Total price:";
        ttTxTd.style.textAlign = "right";
        let ttNmTd = document.createElement("td");
        ttNmTd.innerText = "$" + parseFloat(sum).toFixed(2); 
        tfoorTr.append(ttTxTd,ttNmTd);
        tfoot.append(tfoorTr);

        table.append(thead,tbody,tfoot);
        bdDiv.append(table);
        colDiv.append(bdDiv);
        
        accItDiv.append(h2, colDiv);
        accDiv.append(accItDiv);
        ohDiv.append(accDiv);

        idx++;
    }
}

// click the show button, show a order history
document.querySelector(".show-btn").addEventListener("click", () => {
    showOH();
    if(document.querySelector(".div-cart").style.display === "table") {
        document.querySelector(".div-cart").style.display = "none"; 
    }
    if(document.querySelector(".addpr").style.display === "block") {
        document.querySelector(".addpr").style.display = "none";
    }
    if(document.querySelector(".div-delEmp").style.display === "block") {
        document.querySelector(".div-delEmp").style.display = "none"; 
    }
    let reqData = new FormData();
    reqData.append("req", "show");

    // call the XMLReq function, and send the list of selected products
    xmlReq.Post(reqData).then(
        orderHistory,(rej)=>console.log(rej)
    );
})

// log out button
document.querySelector(".logout-btn").addEventListener("click",() => {
    sessionStorage.removeItem('sid');
    sessionStorage.removeItem('user');
    location.replace('./login.html');
})