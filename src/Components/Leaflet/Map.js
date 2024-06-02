import { MapContainer, TileLayer, LayersControl, LayerGroup } from "react-leaflet"
import PointCluster from "./PointCluster"
import Deflate from "./Deflate"
import Supercluster from "./Supercluster"
import "leaflet/dist/leaflet.css"
import cluster_outlines from "../../Geojson/PolygonClusters/cluster_outlines.json"
import point_clusters from "../../Geojson/PointClusters/point_clusters.json"
import points from "../../Geojson/Points/points_list.json"

export default function Map() {
    return (
        <MapContainer
            className="z-10 h-full w-full"
            center={[47.58393661978137, 13.820800781250002]}
            zoom={7}
            scrollWheelZoom={true}
            preferCanvas={true}>
            <TileLayer
                attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                url="https://mapsneu.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"
                minZoom={7}
                maxZoom={19}
            />
            <LayersControl position="bottomright">
                <LayersControl.Overlay name="Street data">
                    <LayerGroup>
                        <TileLayer
                            attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                            url="https://mapsneu.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png"
                            minZoom={7}
                            maxZoom={19}
                        />
                    </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Street data">
                    <LayerGroup>
                        <TileLayer
                            opacity={50}
                            attribution='Tiles:  <a href="https://basemap.at">basemap.at</a>'
                            url="https://mapsneu.wien.gv.at/basemap/bmapoberflaeche/grau/google3857/{z}/{y}/{x}.jpeg"
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
    )
}
