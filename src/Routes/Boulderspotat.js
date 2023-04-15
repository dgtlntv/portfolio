import { MapContainer, TileLayer, LayersControl, LayerGroup } from "react-leaflet"
import Points from "../Components/Leaflet/Points"
import PointCluster from "../Components/Leaflet/PointCluster"
import Deflate from "../Components/Leaflet/Deflate"
import Supercluster from "../Components/Leaflet/Supercluster"

import "leaflet/dist/leaflet.css"

import vorarlberg_polygon_clusters from "../Geojson/PolygonClusters/vorarlberg_polygon_clusters.json"
import styria_polygon_clusters from "../Geojson/PolygonClusters/styria_polygon_clusters.json"
import loweraustria_polygon_clusters from "../Geojson/PolygonClusters/loweraustria_polygon_clusters.json"
import burgenland_polygon_clusters from "../Geojson/PolygonClusters/burgenland_polygon_clusters.json"
import tyrol_polygon_clusters from "../Geojson/PolygonClusters/tyrol_polygon_clusters.json"
import salzburg_polygon_clusters from "../Geojson/PolygonClusters/salzburg_polygon_clusters.json"
import upperaustria_polygon_clusters from "../Geojson/PolygonClusters/upperaustria_polygon_clusters.json"

import vorarlberg_point_clusters from "../Geojson/PointClusters/vorarlberg_point_clusters.json"
import styria_point_clusters from "../Geojson/PointClusters/styria_point_clusters.json"
import loweraustria_point_clusters from "../Geojson/PointClusters/loweraustria_point_clusters.json"
import burgenland_point_clusters from "../Geojson/PointClusters/burgenland_point_clusters.json"
import tyrol_point_clusters from "../Geojson/PointClusters/tyrol_point_clusters.json"
import salzburg_point_clusters from "../Geojson/PointClusters/salzburg_point_clusters.json"
import upperaustria_point_clusters from "../Geojson/PointClusters/upperaustria_point_clusters.json"

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
                        <LayersControl.Overlay checked={true} name="Overlay">
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
                                <Deflate data={vorarlberg_polygon_clusters} />
                                <Deflate data={styria_polygon_clusters} />
                                <Deflate data={loweraustria_polygon_clusters} />
                                <Deflate data={burgenland_polygon_clusters} />
                                <Deflate data={tyrol_polygon_clusters} />
                                <Deflate data={salzburg_polygon_clusters} />
                                <Deflate data={upperaustria_polygon_clusters} />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name="Point Clusters">
                            <LayerGroup>
                                <PointCluster data={vorarlberg_point_clusters} />
                                <PointCluster data={styria_point_clusters} />
                                <PointCluster data={loweraustria_point_clusters} />
                                <PointCluster data={burgenland_point_clusters} />
                                <PointCluster data={tyrol_point_clusters} />
                                <PointCluster data={salzburg_point_clusters} />
                                <PointCluster data={upperaustria_point_clusters} />
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
