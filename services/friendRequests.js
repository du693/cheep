export const fetchFriendRequests = async (
	username,
	setFriendRequests,
	setIsLoading,
	setError
) => {
	if (!username) return;

	setIsLoading(true);
	setError(null);

	try {
		const response = await fetch(
			`/api/checkFriendRequests?username=${encodeURIComponent(username)}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		setFriendRequests(data);
	} catch (e) {
		setError(e.message);
	} finally {
		setIsLoading(false);
	}
};
export const handleStatusChange = async (
	requestId,
	newStatus,
	setFriendRequests,
	friendRequests
) => {
	try {
		const response = await fetch(
			`/api/checkFriendRequests?id=${requestId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: newStatus }),
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// Refresh the list of friend requests or remove the updated one
		setFriendRequests(
			friendRequests.filter((request) => request._id !== requestId)
		);
	} catch (error) {
		console.error("Failed to update friend request:", error);
	}
};
