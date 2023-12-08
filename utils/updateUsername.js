export default async function updateUsername(email, username) {
	const response = await fetch(
		`/api/updateUser?userId=${encodeURIComponent(email)}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: username }),
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		console.error("Error updating username:", errorData);

		// Check for specific error messages and throw accordingly
		if (errorData.error) {
			throw new Error(errorData.error); // Use the server-provided error message
		} else {
			// Generic error message for other types of server errors
			throw new Error("Failed to update username due to server error.");
		}
	}
	return true;
}
