import{Navigate,Outlet}from"react-router-dom";
 
function AdminProtectedRoute(){
    const token=localStorage.getItem("mainToken");
    if(!token){
        console.log("redirectng to login bcz no token found")
        return<Navigate to="/login"replace/>;
    }
    return <Outlet/>;
}
export default AdminProtectedRoute;
