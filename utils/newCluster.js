import { Cluster } from "@googlemaps/markerclusterer";

export class ExtendedCluster extends Cluster {
	constructor(options) {
		super(options); // Call the parent constructor with the required options
	}

	// Add your new method
	getMarkers() {
		return this.markers;
	}

	getCenter() {
		// Use the bounds of the cluster to find the center
		const bounds = this.bounds;
		if (bounds) {
			return bounds.getCenter();
		}
		// Optional: Fallback in case bounds are not available
		// Calculate the average position of all markers if needed
		if (this.markers.length > 0) {
			let lat = 0,
				lng = 0;
			for (const marker of this.markers) {
				const position = MarkerUtils.getPosition(marker);
				lat += position.lat();
				lng += position.lng();
			}
			return new google.maps.LatLng(
				lat / this.markers.length,
				lng / this.markers.length
			);
		}
		return null; // or some default position if you prefer
	}
}
