import http from "../httpcommon";

class httpSrv {
    check(data) {
        return http.post("/check",data);
    }
    login(data) {
        return http.post("/login", data);
    }
    logout(data) {
        return http.post("/logout", data);
    }
    register(data) {
        return http.post("/register", data);
    }
    ulist(data) {
        return http.post("/ulist",data);
    }
    delUser(data) {
        return http.post("/deluser",data);
    }
    alist(data) {
        return http.post("/alist", data);
    }
    approve(data) {
        return http.post("/approve", data);
    }
    blist(data) {
        return http.post("/blist", data);
    }
    borrow(data) {
        return http.post("/borrow", data);
    }
    bookregister(data) {
        return http.post("/bookregister", data);
    }
    llist(data) {
        return http.post("/lendlist", data);
    }
    returnBook(data) {
        return http.post("/return", data);
    }
    deleteBook(data) {
        return http.post("/bookdelete", data);
    }
}

export default new httpSrv();