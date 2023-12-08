import { getLocation } from "./getLocation";

export async function getGeoLocation(
	locationPermission,
	setLocationPermission,
	setIsLocationMyLocationFunction,
	setUserLocationAvailable,
	onMapLoaded,
	handleMapPending,
	setUserLocationFunction
) {
	let locationTimeout;
	if (navigator.geolocation) {
		locationTimeout = setTimeout(() => {
			if (locationPermission === "pending") {
				console.log("Location request timed out.");
				setLocationPermission("timeout");
				handleMapPending();
			}
		});
		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log(
					"Successfully fetched geolocation:",
					position.coords
				);
				setUserLocationFunction({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				setIsLocationMyLocationFunction(true);

				setLocationPermission("granted");
				getLocation();

				setUserLocationAvailable(true);
				onMapLoaded();
			},
			(error) => {
				clearTimeout(locationTimeout);
				console.log("Error fetching geolocation:", error);
				setLocationPermission("denied");
			}
		);
	} else {
		console.log("Geolocation is not supported by this browser.");
		setLocationPermission("unsupported");
	}
	return () => clearTimeout(locationTimeout);
}
