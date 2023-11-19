import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ExtendedCluster } from "./newCluster";

export class CustomMarkerClusterer extends MarkerClusterer {
	// Override the method that creates Cluster instances
	// This is a hypothetical example; the actual method name and implementation
	// will depend on how MarkerClusterer is implemented.
	createCluster(...args) {
		// Instead of creating a Cluster instance, create an ExtendedCluster instance
		return new ExtendedCluster(...args);
	}
}
