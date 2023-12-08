export async function getLocation(
	coordinates,
	locationPermission,
	setCoordinates,
	setIsLocationMyLocationFunction,
	setUserLocationToggleFunction,
	userLocation,
	mapInstanceRef
) {
	const { Marker } = await loader.importLibrary("marker");
	// Remove the previous marker if it exists
	if (previousMarker) {
		previousMarker.setMap(null);
	}

	if (coordinates) {
		const lat = coordinates.lat;
		const lng = coordinates.lng;
		setCoordinates({ lat, lng });
		setIsLocationMyLocationFunction(false);

		const newMarker = new Marker({
			position: {
				lat: parseFloat(lat),
				lng: parseFloat(lng),
			},
			icon: {
				scaledSize: new window.google.maps.Size(15, 25),
				url: `/clickMarker.png`,
			},
			title: "User Location",
			map: mapInstanceRef.current,
			optimized: false,
		});

		// Store the new marker as the previous marker
		previousMarker = newMarker;
	} else if (userLocation.lat !== null && userLocation.lng !== null) {
		setCoordinates({
			lat: userLocation.lat,
			lng: userLocation.lng,
		});
		setIsLocationMyLocationFunction(true);
		setUserLocationToggleFunction(false);

		const newMarker = new Marker({
			position: {
				lat: parseFloat(userLocation.lat),
				lng: parseFloat(userLocation.lng),
			},
			icon: {
				scaledSize: new window.google.maps.Size(30, 30),
				url: `/selfIndicator.png`,
			},
			title: "User Location",
			map: mapInstanceRef.current,
			zIndex: 10,
		});

		// Store the new marker as the previous marker
		previousMarker = newMarker;

		setDidAttemptSetFromUserLocation(true);
	}
}
