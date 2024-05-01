function LendRow (props) {
    return (
        <>
            <tr>
                <td>{props.lend.isbn}</td>
                <td>{props.lend.bname}</td>
                <td>{props.lend.author}</td>
                <td>{props.lend.rdate}</td>
            </tr>
        </>
    )
}
export default LendRow