import { useEffect, useMemo, useState } from "react"
import * as L from "leaflet"
import useSupercluster from "use-supercluster"
import { Marker, CircleMarker, useMap } from "react-leaflet"
import debounce from "lodash.debounce"

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

    const onMove = useMemo(() => debounce(updateMap, 50), [map, updateMap])

    useEffect(() => {
        updateMap()
    }, [map])

    useEffect(() => {
        map.on("move", onMove)
        return () => {
            map.off("move", onMove)
        }
    }, [map, onMove])

    const { clusters, supercluster } = useSupercluster({
        points: data,
        bounds: bounds,
        zoom: zoom,
        options: { radius: 150, maxZoom: 17 },
    })

    const maxPointsInView = useMemo(() => {
        let maxPoints = 0
        clusters.forEach((cluster) => {
            if (cluster.properties.cluster) {
                maxPoints = Math.max(maxPoints, cluster.properties.point_count)
            }
        })
        return maxPoints
    }, [clusters])

    return (
        <>
            {clusters.map((cluster) => {
                // every cluster point has coordinates
                const [longitude, latitude] = cluster.geometry.coordinates
                // the point may be either a cluster or a crime point
                const { cluster: isCluster, point_count: pointCount } = cluster.properties

                // we have a cluster to render
                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.properties.cluster_id}`}
                            position={[latitude, longitude]}
                            icon={L.divIcon({
                                html: `<div class="cluster-marker" style="width: ${
                                    1 + (pointCount / maxPointsInView) * 75
                                }px;  min-width: min-content; min-height: min-content">
                                ${pointCount}
                              </div>`,
                            })}
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
