import { MapContainer, TileLayer, GeoJSON, LayersControl, LayerGroup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import vorarlberg from "../Geojson/vorarlberg.json"
import styria from "../Geojson/styria.json"
import loweraustria from "../Geojson/loweraustria.json"
import burgenland from "../Geojson/burgenland.json"
import Navigation from "../Components/GlobalLayout/Navigation"
import Footer from "../Components/GlobalLayout/Footer"

export default function Boulderspotat() {
    const stats = [
        { label: "Context", value: "University, Work & Personal Projects" },
        { label: "Period", value: "2018 - now" },
    ]

    return (
        <div className="flex h-screen w-screen flex-col px-0 md:px-4">
            <Navigation />
            <div className="flex-1 overflow-hidden rounded-xl bg-white shadow-xl">
                <MapContainer
                    className="z-10 h-full w-full"
                    center={[48.128334, 16.259766]}
                    minZoom={7}
                    maxZoom={19}
                    zoom={13}
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                        subdomains={["maps", "maps1", "maps2", "maps3", "maps4"]}
                        url="https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"
                    />
                    <LayersControl position="topright">
                        <LayersControl.Overlay name="Cluster">
                            <LayerGroup>
                                <GeoJSON data={vorarlberg} />
                                <GeoJSON data={styria} />
                                <GeoJSON data={loweraustria} />
                                <GeoJSON data={burgenland} />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </div>

            <Footer slim={true} />
        </div>
    )
}
