import React, { useState, useEffect, useContext } from "react";

import { Username } from "@/context/Context";
import styles from "./currentrequests.module.css";

const FriendRequests = () => {
	const [friendRequests, setFriendRequests] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const { username } = useContext(Username); // Context to provide the logged-in user's username

	useEffect(() => {
		const fetchFriendRequests = async () => {
			if (!username) return;

			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/checkFriendRequests?username=${encodeURIComponent(
						username
					)}`
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

		fetchFriendRequests();
	}, [username]);

	const handleStatusChange = async (requestId, newStatus) => {
		console.log("clicked");
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

	// This effect should run whenever the username changes

	if (isLoading) {
		return <div>Loading friend requests...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!friendRequests.length) {
		return <div></div>;
	}

	return (
		<div className={styles.friendReqsSection}>
			<h2>
				<u>Friend Requests</u>
			</h2>
			<ul className={styles.friendReqs}>
				{friendRequests.map((request) => (
					<li className={styles.friendReq} key={request._id}>
						{request.sender}
						<button
							className={styles.reqButtonAccept}
							onClick={() =>
								handleStatusChange(request._id, "accepted")
							}
						>
							Accept
						</button>
						<button
							className={styles.reqButtonReject}
							onClick={() =>
								handleStatusChange(request._id, "rejected")
							}
						>
							Reject
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default FriendRequests;
