import { GeoJSON } from "react-leaflet"
import randomColor from "randomcolor"

export default function Polygons({ data }) {
    return (
        <GeoJSON
            data={data}
            onEachFeature={(feature, layer) => {
                layer.setStyle({
                    fillOpacity: 0,
                    color: randomColor(feature.properties.CLUSTER_ID),
                    weight: 2,
                })
            }}
        />
    )
}
