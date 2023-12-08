async function addSpot({
	bird,
	lat,
	lng,
	description,
	username,
	setSpotted,
	session,
	spotted,
}) {
	const birdNamePattern = /^[a-zA-Z\s]+$/;
	const latLngPattern = /^-?\d+(\.\d+)?$/;
	const descriptionPattern = /^[a-zA-Z0-9\s]+$/;

	if (
		!spotted.some(
			(fav) =>
				birdNamePattern.test(fav?.birdName) &&
				latLngPattern.test(fav?.lat) &&
				latLngPattern.test(fav?.lng) &&
				descriptionPattern.test(fav?.description) &&
				fav?.birdName === bird &&
				fav.lat === lat &&
				fav.lng === lng &&
				fav.description === description
		)
	) {
		if (lat !== null && lng !== null) {
			if (
				birdNamePattern.test(bird) &&
				latLngPattern.test(lat) &&
				latLngPattern.test(lng) &&
				descriptionPattern.test(description)
			) {
				const newSpotted = {
					birdName: bird,
					lat: lat,
					lng: lng,
					description: description,
				};

				setSpotted((prevSpotted) => [...prevSpotted, newSpotted]);

				try {
					const response = await fetch("/api/updateUser", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userId: session.user.email,
							username: username,
							spotted: newSpotted,
						}),
					});

					console.log("After first fetch");

					if (response.ok) {
						console.log("Successfully updated user.");
					} else {
						const errorData = await response.json();
						console.error("Error updating user:", errorData);
					}
				} catch (error) {
					console.error("An error occurred:", error);
				}
			} else {
				console.error("Invalid input data");
			}
		} else {
			console.error("Latitude and Longitude are not filled");
		}
	} else {
		console.log(
			"This combination of bird, lat, and lng already exists in spotted"
		);
	}
}

export { addSpot };
