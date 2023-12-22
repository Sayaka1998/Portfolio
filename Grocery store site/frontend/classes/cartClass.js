import Product from "./productClass.js";
class Cart extends Product {
    constructor(pid, pname, price, pimg, amount = 1){
        super(pid, pname, price, pimg);
        this.amount = amount;
    }
    
    // calculate total
    total() {
        return (this.price * this.amount).toFixed(2);
    }

    // return tr to generate a table of cart
    Tr() {
        let tr = super.Tr(); // Product.Tr()
        // the td of amount has a input emelent 
        let input = document.createElement("input");
        input.type = "number";
        // when user change the amount, change the total
        input.addEventListener("change", (e) => {
            this.amount = parseInt(e.target.value);
            e.target.parentElement.nextSibling.innerText = this.total(); // e.target.parentElement.nextSibling = totalTd 
        })
        input.value = this.amount;
        let td = document.createElement("td");
        td.append(input);
        // the td of total
        let totalTd = document.createElement("td");
        totalTd.innerText = "$" + this.total();
        // delete button
        let delTd = document.createElement("td");
        let delBtn = document.createElement("button");
        delBtn.className = "btn btn-outline-secondary";
        delBtn.type = "button";
        delBtn.innerText = "Delete";
        delTd.append(delBtn);
        
        tr.append(td,totalTd,delTd);
        return tr;
    }
}

export default Cart;