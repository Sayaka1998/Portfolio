import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import httpSrv from "../services/httpSrv";
import UserRow from "./UserRow";
function UserList() {
    const nav = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem("sid") == undefined) {
            nav("/");
        }
    })

    const deleteUser = (delUser) => {
        if (delUser) {
            let data = new FormData()
            data.append("userData", JSON.stringify(delUser))
            data.append("sid", sessionStorage.getItem("sid"))
            if (window.confirm("Are you sure to delete this user?")) {
                httpSrv.delUser(data).then(
                    res => {
                        if (res.data.logout) {
                            sessionStorage.removeItem("type")
                            sessionStorage.removeItem("sid")
                            alert(res.data.logout)
                            nav("/")
                        } else if (res.data.message) {
                            alert(res.data.message)
                            window.location.reload()
                        }
                    },
                    rej => {
                        alert(rej);
                    }
                )
            } else {
                alert("Thus request was canceled.")
            }
        }
    }

    const [users, setUsers] = useState([])
    // load a user list 
    const userLoad = () => {
        if (users.length == 0) {
            let data = new FormData();
            data.append("sid", sessionStorage.getItem("sid"))
            httpSrv.ulist(data).then(
                res => {
                    if (res.data.logout) {
                        sessionStorage.removeItem("type")
                        sessionStorage.removeItem("sid")
                        alert(res.data.logout)
                        nav("/")
                    } else if (res.data.message) {
                        alert(res.data.message)
                    } else if (Array.isArray(res.data)) {
                        setUsers(res.data)
                    }
                },
                rej => {
                    alert(rej);
                }
            )
        }
    }
    userLoad();

    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-success">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Firstname</th>
                                        <th>Lastname</th>
                                        <th>Email</th>
                                        <th>User type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, idx) => { return (<UserRow key={idx} user={user} deleteUser={deleteUser} />) })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserList