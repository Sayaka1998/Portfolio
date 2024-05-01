import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import httpSrv from "../services/httpSrv";
import BookRow from "./BookRow";
import CartRow from "./CartRow";
function Blist() {
    const nav = useNavigate();
    useEffect(() => {
        // if the user doesn't log in, back to the login page
        if (sessionStorage.getItem("sid") == undefined) {
            nav("/");
        }
    });

    const [cart, setCart] = useState([]);
    const addCart = (newBook) => {
        let flag = true;
        for (let book of cart) {
            // check if the book is already added to the user cart
            if (book.isbn == newBook.isbn) {
                flag = false;
                return false;
            }
        }
        if (flag) { // if the book data doesn't exist in the cart, add the book to the cart
            setCart(prevCart => {
                return [...prevCart, newBook];
            })
        }
    }

    const rmvBook = (rmvIdx) => { // remove the book from the cart
        cart.splice(rmvIdx, 1);
        setCart([...cart]);
    }

    const borrow = () => {
        if (cart.length != 0) { // if some books in the cart 
            let data = new FormData();
            data.append("book", JSON.stringify(cart)); // book data array 
            data.append("sid", sessionStorage.getItem("sid"));
            httpSrv.borrow(data).then(
                res => {
                    if (res.data.logout) {
                        sessionStorage.removeItem("sid");
                        sessionStorage.removeItem("type");
                        alert(res.data.logout);
                        nav("/");
                    } else if(res.data.message) {
                        alert(res.data.message);
                        window.location.reload();
                    }
                },
                rej => {
                    alert(rej);
                }
            )
        } else {
            alert("No book in your cart")
        }
    }

    const returnBook = (reBook) => {
        if(reBook) {
            let data = new FormData();
            data.append("reBook",JSON.stringify(reBook))
            data.append("sid",sessionStorage.getItem("sid"))
            if(window.confirm("Are you sure to return this book?")) {
                httpSrv.returnBook(data).then(
                    res => {
                        if (res.data.logout) {
                            sessionStorage.removeItem("sid");
                            sessionStorage.removeItem("type");
                            alert(res.data.logout);
                            nav("/");
                        } else if(res.data.message) {
                            alert(res.data.message);
                            window.location.reload();
                        }
                    },
                    rej => {
                        alert(rej);
                    }
                )
            } else {
                alert("This request was canceled.")
            }
        }
    }

    const deleteBook = (delBook) => {
        if(delBook) {
            let data = new FormData();
            data.append("delBook",JSON.stringify(delBook))
            data.append("sid",sessionStorage.getItem("sid"))
            if(window.confirm("Are you sure to delete this book?")) {
                httpSrv.deleteBook(data).then(
                    res => {
                        if (res.data.logout) {
                            sessionStorage.removeItem("sid");
                            sessionStorage.removeItem("type");
                            alert(res.data.logout);
                            nav("/");
                        } else if(res.data.message) {
                            alert(res.data.message);
                            window.location.reload();
                        }
                    },
                    rej => {
                        alert(rej);
                    }
                )
            } else {
                alert("This request was canceled.")
            }
        }
    }

    const [books, setBooks] = useState([]);
    const bookLoad = () => {
        if (books.length == 0) { // load the book in the library from the back-end
            let data = new FormData();
            data.append("sid", sessionStorage.getItem("sid"));
            httpSrv.blist(data).then(
                res => {
                    if (res.data.logout) {
                        sessionStorage.removeItem("type");
                        sessionStorage.removeItem("sid");
                        alert(res.data.logout);
                        nav("/");
                    } else if (res.data.message) {
                        alert(res.data.message);
                    } else if (Array.isArray(res.data)) {
                        setBooks(res.data);
                    }
                },
                rej => {
                    alert(rej);
                }
            )
        }
    }
    bookLoad();

    const [category, setCategory] = useState("All");
    const filteredBooks = category === "All" ? books : books.filter(book => book.category === category) 

    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-top g-2">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-success">
                                <thead>
                                    <tr>
                                        <th>ISBN</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>
                                            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                                <option value="All">Category</option>
                                                <option value="Drama">Drama</option>
                                                <option value="Fantasy">Fantasy</option>
                                                <option value="History">History</option>
                                                <option value="Young adult">Young adult</option>
                                            </select>
                                        </th>
                                        <th>Status</th>
                                        {
                                            sessionStorage.getItem("type") != "Customer" ?
                                            <th colSpan="2">Options</th>:null
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBooks.map((book, idx) => { return (<BookRow key={idx} book={book} borrow={addCart} return={returnBook} delete={deleteBook}/>) })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col" style={{ display: (sessionStorage.getItem("type") != "Customer") ? "none" : "block" }}>
                        <div className="table-responsive">
                            <table className="table table-secondary">
                                <thead>
                                    <tr>
                                        <th>ISBN</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((book, idx) => { return (<CartRow key={idx} book={book} rmv={rmvBook} />) })}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-outline-success" onClick={borrow}>Borrow</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Blist;