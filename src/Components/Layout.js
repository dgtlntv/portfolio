import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navigation from "./Navigation";

function Layout() {
    return (
        <div>
            <Navigation />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Layout;
