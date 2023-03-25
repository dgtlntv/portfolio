import { useCallback, useEffect, useState } from "react"
import * as L from "leaflet"
import useSupercluster from "use-supercluster"
import { Marker, CircleMarker, useMap } from "react-leaflet"

const icons = {}
const fetchIcon = (count, size) => {
    if (!icons[count]) {
        icons[count] = L.divIcon({
            html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
        ${count}
      </div>`,
        })
    }
    return icons[count]
}

export default function Supercluster({ data }) {
    const maxZoom = 19
    const [bounds, setBounds] = useState(null)
    const [zoom, setZoom] = useState(12)
    const map = useMap()

    // get map bounds
    function updateMap() {
        const b = map.getBounds()
        setBounds([b.getSouthWest().lng, b.getSouthWest().lat, b.getNorthEast().lng, b.getNorthEast().lat])
        setZoom(map.getZoom())
    }

    const onMove = useCallback(() => {
        updateMap()
    }, [map])

    useEffect(() => {
        updateMap()
    }, [map])

    useEffect(() => {
        map.on("move", onMove)
        return () => {
            map.off("move", onMove)
        }
    }, [map, onMove])

    const points = data.features.map((feature, index) => ({
        type: "Feature",
        properties: { cluster: false, cluster_id: index },
        geometry: {
            type: "Point",
            coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
        },
    }))

    const { clusters, supercluster } = useSupercluster({
        points: points,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 250, maxZoom: 17 },
    })

    return (
        <>
            {clusters.map((cluster) => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates
                // the point may be either a cluster or a crime point
                const { cluster: isCluster, point_count: pointCount } = cluster.properties

                console.log(pointCount)

                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.properties.cluster_id}`}
                            position={[latitude, longitude]}
                            icon={fetchIcon(pointCount, 10 + (pointCount / points.length) * 40)}
                            eventHandlers={{
                                click: () => {
                                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), maxZoom)
                                    map.setView([latitude, longitude], expansionZoom, {
                                        animate: true,
                                    })
                                },
                            }}
                        />
                    )
                }

                // we have a single point to render
                return (
                    <CircleMarker
                        key={`cluster-${cluster.properties.cluster_id}`}
                        center={[latitude, longitude]}
                        radius={2}
                    />
                )
            })}
        </>
    )
}
