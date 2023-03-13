import { MapContainer, TileLayer, LayersControl, LayerGroup } from "react-leaflet"
import Points from "../Components/Leaflet/Points"
import PointCluster from "../Components/Leaflet/PointCluster"
import Deflate from "../Components/Leaflet/Deflate"

import "leaflet/dist/leaflet.css"

import vorarlberg_polygon_clusters from "../Geojson/PolygonClusters/vorarlberg_polygon_clusters.json"
import styria_polygon_clusters from "../Geojson/PolygonClusters/styria_polygon_clusters.json"
import loweraustria_polygon_clusters from "../Geojson/PolygonClusters/loweraustria_polygon_clusters.json"
import burgenland_polygon_clusters from "../Geojson/PolygonClusters/burgenland_polygon_clusters.json"
import tyrol_polygon_clusters from "../Geojson/PolygonClusters/tyrol_polygon_clusters.json"

import vorarlberg_point_clusters from "../Geojson/PointClusters/vorarlberg_point_clusters.json"
import styria_point_clusters from "../Geojson/PointClusters/styria_point_clusters.json"
import loweraustria_point_clusters from "../Geojson/PointClusters/loweraustria_point_clusters.json"
import burgenland_point_clusters from "../Geojson/PointClusters/burgenland_point_clusters.json"
import tyrol_point_clusters from "../Geojson/PointClusters/tyrol_point_clusters.json"

import vorarlberg_raw_points from "../Geojson/Points/vorarlberg_points.json"
import styria_raw_points from "../Geojson/Points/styria_points.json"
import loweraustria_raw_points from "../Geojson/Points/loweraustria_points.json"
import burgenland_raw_points from "../Geojson/Points/burgenland_points.json"
import tyrol_raw_points from "../Geojson/Points/tyrol_points.json"

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
                        <LayersControl.Overlay checked={true} name="Cluster Outlines">
                            <LayerGroup>
                                <Deflate data={vorarlberg_polygon_clusters} />
                                <Deflate data={styria_polygon_clusters} />
                                <Deflate data={loweraustria_polygon_clusters} />
                                <Deflate data={burgenland_polygon_clusters} />
                                <Deflate data={tyrol_polygon_clusters} />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name="Point Clusters">
                            <LayerGroup>
                                <PointCluster data={vorarlberg_point_clusters} />
                                <PointCluster data={styria_point_clusters} />
                                <PointCluster data={loweraustria_point_clusters} />
                                <PointCluster data={burgenland_point_clusters} />
                                <PointCluster data={tyrol_point_clusters} />
                            </LayerGroup>
                        </LayersControl.Overlay>

                        <LayersControl.Overlay name="Raw Points">
                            <LayerGroup>
                                <Points data={vorarlberg_raw_points} />
                                <Points data={styria_raw_points} />
                                <Points data={loweraustria_raw_points} />
                                <Points data={burgenland_raw_points} />
                                <Points data={tyrol_raw_points} />
                            </LayerGroup>
                        </LayersControl.Overlay>
                    </LayersControl>
                </MapContainer>
            </div>

            <Footer slim={true} />
        </div>
    )
}
