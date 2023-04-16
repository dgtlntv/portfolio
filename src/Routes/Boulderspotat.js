import { MapContainer, TileLayer, LayersControl, LayerGroup } from "react-leaflet"
import PointCluster from "../Components/Leaflet/PointCluster"
import Deflate from "../Components/Leaflet/Deflate"
import Supercluster from "../Components/Leaflet/Supercluster"
import "leaflet/dist/leaflet.css"
import cluster_outlines from "../Geojson/PolygonClusters/cluster_outlines.json"
import point_clusters from "../Geojson/PointClusters/point_clusters.json"
import points from "../Geojson/Points/points_list.json"
import Navigation from "../Components/GlobalLayout/Navigation"
import Footer from "../Components/GlobalLayout/Footer"

export default function Boulderspotat() {
    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col px-0 md:px-4">
            <Navigation />
            <div className="flex-1 overflow-hidden rounded-xl bg-white shadow-xl">
                <MapContainer
                    className="z-10 h-full w-full"
                    center={[48.128334, 16.259766]}
                    zoom={13}
                    scrollWheelZoom={true}
                    preferCanvas={true}>
                    <TileLayer
                        attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                        subdomains={["maps", "maps1", "maps2", "maps3", "maps4"]}
                        url="https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"
                        minZoom={7}
                        maxZoom={19}
                    />
                    <LayersControl position="topright">
                        <LayersControl.Overlay name="Overlay">
                            <LayerGroup>
                                <TileLayer
                                    attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                                    subdomains={["maps", "maps1", "maps2", "maps3", "maps4"]}
                                    url="https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png"
                                    minZoom={7}
                                    maxZoom={19}
                                />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay checked={true} name="Cluster Outlines">
                            <LayerGroup>
                                <Deflate data={cluster_outlines} />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name="Point Clusters">
                            <LayerGroup>
                                <PointCluster data={point_clusters} />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name="Raw Points">
                            <LayerGroup>
                                <Supercluster data={points} />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </div>

            <Footer slim={true} />
        </div>
    )
}
