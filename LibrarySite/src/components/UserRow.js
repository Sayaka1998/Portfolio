function UserRow(props) {
    const deleteUserHandler = () => {
        props.deleteUser(props.user)
    }
    return(
        <tr>
            <td>{props.user.uid}</td>
            <td>{props.user.fname}</td>
            <td>{props.user.lname}</td>
            <td>{props.user.email}</td>
            <td>{props.user.type}</td>
            <td><button type="button" className="btn btn-outline-danger" onClick={deleteUserHandler}>Delete</button></td>
        </tr>
    )
}

export default UserRow