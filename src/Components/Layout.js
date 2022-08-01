import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import Navigation from "./Navigation"

function Layout() {
    return (
        <div>
            <Navigation />
            <div className="relativ">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout
