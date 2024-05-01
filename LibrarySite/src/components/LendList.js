import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import httpSrv from "../services/httpSrv";
import LendRow from "./LendRow";

function LendList () {
    const nav = useNavigate();
    useEffect(() => {
        if(sessionStorage.getItem("sid") == undefined) {
            nav("/");
        }
    })

    const [llist, setLlist] = useState([]);
    const lendlistload = () => {
        if (llist.length == 0) {
            let data = new FormData();
            data.append("sid", sessionStorage.getItem("sid"));
            httpSrv.llist(data).then(
                res => {
                    if (res.data.logout) {
                        sessionStorage.removeItem("type");
                        sessionStorage.removeItem("sid");
                        alert(res.data.logout);
                        nav("/");
                    } else if (res.data.message) {
                        alert(res.data.message);
                    } else if (Array.isArray(res.data)) {
                        setLlist(res.data);
                        console.log(res.data)
                    } else {
                        console.log(res.data)
                    }
                },
                rej => {
                    alert(rej);
                }
            )
        }
    }
    lendlistload();


    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col">
                        <div className="table-responsive" >
                            <table className="table table-secondary">
                                <thead>
                                    <tr>
                                        <th>ISBN</th>
                                        <th>Book Name</th>
                                        <th>Author</th>
                                        <th>Return date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {llist.length != 0 ? (llist.map((lend,idx) => {return (<LendRow key={idx} lend={lend}/>)})) : (<tr><td colSpan="6">No borrowed book</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>  
        </>
    )
}

export default LendList