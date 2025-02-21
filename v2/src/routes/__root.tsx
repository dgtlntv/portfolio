import { createRootRoute, Outlet } from "@tanstack/react-router"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation/Navigation"

export const Route = createRootRoute({
    component: () => (
        <div>
            <Navigation />
            <div className="relativ">
                <Outlet />
            </div>
            <Footer />
        </div>
    ),
})
