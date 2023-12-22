import Cart from "./cartClass.js";

class Item extends Cart{
    constructor(pid, pname, price, pimg, amount, total) {
        super(pid, pname, price,pimg, amount);
        this.total = parseFloat(total);
    }
}

export default Item;