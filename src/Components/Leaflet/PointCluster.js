import { GeoJSON } from "react-leaflet"
import * as L from "leaflet"
import randomColor from "randomcolor"

export default function PointCluster({ data }) {
    return (
        <GeoJSON
            data={data}
            pointToLayer={(feature, latlng) => {
                if (feature.properties.CLUSTER_ID === null) {
                    return
                } else {
                    return L.circleMarker(latlng, {
                        radius: 2,
                        fillColor: randomColor({ seed: feature.properties.CLUSTER_ID }),
                        color: randomColor({ seed: feature.properties.CLUSTER_ID }),
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8,
                    })
                }
            }}
        />
    )
}
