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
	if (
		!spotted.some(
			(fav) =>
				fav?.birdName === bird &&
				fav.lat === lat &&
				fav.lng === lng &&
				fav.description === description
		)
	) {
		if (lat !== null && lng !== null) {
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
			console.error("Latitude and Longitude are not filled");
		}
	} else {
		console.log(
			"This combination of bird, lat, and lng already exists in spotted"
		);
	}
}
export { addSpot };
