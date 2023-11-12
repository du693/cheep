async function fetchAndSetMarkers(map, expandFactor = 0.1, delay = 1000) {
	// Calculate the bounds of the current map view
	const bounds = map.getBounds();
	const NE = bounds.getNorthEast(); // Top right corner of the map
	const SW = bounds.getSouthWest(); // Bottom left corner of the map

	// Expanding the bounds by the expandFactor
	const latDiff = NE.lat() - SW.lat();
	const lngDiff = NE.lng() - SW.lng();

	const expandedNE = {
		lat: NE.lat() + latDiff * expandFactor,
		lng: NE.lng() + lngDiff * expandFactor,
	};

	const expandedSW = {
		lat: SW.lat() - latDiff * expandFactor,
		lng: SW.lng() - lngDiff * expandFactor,
	};

	// Parameters for the expanded bounds
	const params = {
		north: expandedNE.lat,
		east: expandedNE.lng,
		south: expandedSW.lat,
		west: expandedSW.lng,
	};

	// Delay fetching new data
	await new Promise((resolve) => setTimeout(resolve, delay));

	try {
		// Fetch data based on expanded bounds
		const spotsData = await fetchYourData(params);
		// Assume fetchYourData returns an array of spot objects

		// Process and create markers...
		// ...
	} catch (error) {
		console.error("Error fetching spots data:", error);
	}
}
