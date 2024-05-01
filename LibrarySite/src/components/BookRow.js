function BookRow(props) {

    const borrowHandler = () => { // return the selected book data to the book list
        props.borrow(props.book);
    } 

    const returnHandler = () => {
        props.return(props.book);
    }

    const deleteHandler = () => {
        props.delete(props.book);
    }

    return(
        <tr>
            <td>{props.book.isbn}</td>
            <td>{props.book.bname}</td>
            <td>{props.book.author}</td>
            <td>{props.book.category}</td>
            <td>
                {
                    sessionStorage.getItem("type") != "Customer" ?
                    (props.book.status)
                    :
                    <button type="button" className="btn btn-outline-secondary" disabled={props.book.status == "unavailable"} onClick={borrowHandler}>{props.book.status}</button>
                }
            </td>
            {
                sessionStorage.getItem("type") != "Customer" ?
                <td><button type="button" className="btn btn-outline-primary" disabled={props.book.status == "available"} onClick={returnHandler}>Return</button></td>
                :null
            }
            {
                sessionStorage.getItem("type") != "Customer" ?
                <td><button type="button" className="btn btn-outline-danger" disabled={props.book.status == "unavailable"} onClick={deleteHandler}>Delete</button></td>
                :null
            }
        </tr>
    )
}
export default BookRow;