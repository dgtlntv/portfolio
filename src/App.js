import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import Landing from "./Routes/Landing"
import Portfolio from "./Routes/Portfolio"
import Layout from "./Components/GlobalLayout/Layout"
import Neueux from "./Routes/Neueux"
import PortfolioCover from "./Routes/PortfolioCover"
import Talk from "./Routes/Talk"
import MLRUG from "./Routes/MLRUG"
import Knowledgement from "./Routes/Knowledgement"
import Graphics from "./Routes/Graphics"
import "./index.css"
import ScrollToTop from "./Components/GlobalLayout/ScrollToTop"

export default function App() {
    const location = useLocation()
    return (
        <ScrollToTop>
            <TransitionGroup component={null}>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Routes>
                        <Route index element={<Landing />} />
                        <Route path="/" element={<Layout />}>
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/neueux" element={<Neueux />} />
                            <Route path="/portfoliocover" element={<PortfolioCover />} />
                            <Route path="/talk" element={<Talk />} />
                            <Route path="/mlrug" element={<MLRUG />} />
                            <Route path="/knowledgement" element={<Knowledgement />} />
                            <Route path="/graphics" element={<Graphics />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Route>
                    </Routes>
                </CSSTransition>
            </TransitionGroup>
        </ScrollToTop>
    )
}
