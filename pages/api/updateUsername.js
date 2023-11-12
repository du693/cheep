export default async function updateUsername(email, username) {
	const response = await fetch(
		`/api/updateUser?userId=${encodeURIComponent(email)}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
			}),
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		console.error("Couldn't update username:", errorData);
		throw new Error("Username has already been picked.");
	}
	return true;
}
