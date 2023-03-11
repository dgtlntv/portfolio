import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import vorarlberg from "../Geojson/vorarlberg.json"
import styria from "../Geojson/styria.json"
import loweraustria from "../Geojson/loweraustria.json"
import burgenland from "../Geojson/burgenland.json"

export default function Boulderspotat() {
    const stats = [
        { label: "Context", value: "University, Work & Personal Projects" },
        { label: "Period", value: "2018 - now" },
    ]

    return (
        <div className="h-screen w-full px-24">
            <div className="h-full w-full overflow-hidden rounded-xl">
                <MapContainer
                    className="h-full w-full"
                    center={[48.128334, 16.259766]}
                    minZoom={7}
                    maxZoom={19}
                    zoom={13}
                    scrollWheelZoom={true}>
                    <GeoJSON data={vorarlberg} />
                    <GeoJSON data={styria} />
                    <GeoJSON data={loweraustria} />
                    <GeoJSON data={burgenland} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        subdomains={["maps", "maps1", "maps2", "maps3", "maps4"]}
                        url="https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"
                    />
                </MapContainer>
            </div>
        </div>
    )
}
