import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Routes/Landing";
import Portfolio from "./Routes/Portfolio";
import Layout from "./Components/Layout";
import Neueux from "./Routes/Neueux";
import Website from "./Routes/Website";
import Talk from "./Routes/Talk";
import Dadadazed from "./Routes/Dadadazed";
import Knowledgement from "./Routes/Knowledgement";
import Graphics from "./Routes/Graphics";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Landing />} />
                <Route path="/" element={<Layout />}>
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/neueux" element={<Neueux />} />
                    <Route path="/website" element={<Website />} />
                    <Route path="/talk" element={<Talk />} />
                    <Route path="/dadadazed" element={<Dadadazed />} />
                    <Route path="/knowledgement" element={<Knowledgement />} />
                    <Route path="/graphics" element={<Graphics />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
