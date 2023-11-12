async function fetchGlobalSpots() {
	try {
		const response = await fetch(`/api/globalSpotted`);
		if (!response.ok) {
			throw new Error("Fetch request failed");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching global spots:", error);
		return [];
	}
}

async function fetchDatData() {
	const globalSpots = await fetchGlobalSpots();
	return globalSpots;
}

export default fetchDatData;
