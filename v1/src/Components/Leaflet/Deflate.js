import * as L from "leaflet"
import "Leaflet.Deflate"
import randomColor from "randomcolor"
import { createElementObject, createPathComponent, extendContext } from "@react-leaflet/core"

const Deflate = createPathComponent(
    function createDeflate({ data, ...options }, ctx) {
        const features = L.deflate({
            minSize: 5,
            markerType: L.circleMarker,
            markerOptions: function (f) {
                return {
                    radius: 3,
                    fillColor: randomColor({ seed: f.feature.properties.CLUSTER_ID }),
                    color: randomColor({ seed: f.feature.properties.CLUSTER_ID }),
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1,
                }
            },
        })

        L.geoJson(data, {
            onEachFeature: (feature, layer) => {
                layer.setStyle({
                    fillOpacity: 0,
                    color: randomColor({ seed: feature.properties.CLUSTER_ID }),
                    weight: 2,
                })
                layer.on("click", (e) => {
                    // show popup with Latitute and Longitude of the clicked feature
                    layer.bindPopup(`Latidude: ${e.latlng.lat} <br> Longitude: ${e.latlng.lng}`)
                })
            },
        }).addTo(features)

        return createElementObject(features, extendContext(ctx, { overlayContainer: features }))
    },

    function updateDeflate(layer, props, prevProps) {
        if (props.style !== prevProps.style) {
            if (props.style == null) {
                layer.resetStyle()
            } else {
                layer.setStyle(props.style)
            }
        }
    }
)

export default Deflate
