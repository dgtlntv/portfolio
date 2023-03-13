import { GeoJSON } from "react-leaflet"
import * as L from "leaflet"

export default function Points({ data }) {
    return (
        <GeoJSON
            data={data}
            pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, {
                    radius: 2,
                    fillColor: "#ff0000",
                    color: "#ff0000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                })
            }}
        />
    )
}
