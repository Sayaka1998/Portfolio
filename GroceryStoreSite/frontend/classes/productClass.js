class Product {
    constructor(pid,pname,price, pimg) {
        this.pid = pid;
        this.pname = pname;
        this.price = price;
        this.pimg = pimg;
    }

    // return tr to generate a table of cart
    Tr() {
        let tr = document.createElement("tr");
        for(let index in Object.values(this)) { // this products
            if(!(index == 3 || index == 4)) { // if key is not pimg or amount = if key is pid ,pname or price
                let td = document.createElement("td");
                if(index == 2) {
                    td.innerText = "$" + Object.values(this)[index];
                } else {
                    td.innerText = Object.values(this)[index];
                }
                tr.append(td);
            }
        }
        return tr;
    }
}

export default Product;