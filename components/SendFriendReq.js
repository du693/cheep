import React, { useEffect, useState } from "react";
import styles from "./sendfriendreq.module.css";

const FriendRequestForm = (username) => {
	const [sender, setSender] = useState(""); // Assuming you have the sender's username somehow, perhaps from the session
	const [receiver, setReceiver] = useState("");

	// this handle submit function should take session username, and input,
	//it will then take the input and check if it is an existing username, if its not we will alert.
	//if it is an existing username we will allow the api/friendRequestConnect to POST
	useEffect(() => {
		setSender(username.username);
	}, []);
	const checkUsernameExists = async (senderUsername) => {
		const response = await fetch("/api/checkUsername", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: senderUsername }),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	};

	const handleSubmit = async (event) => {
		console.log();
		event.preventDefault();
		if (!sender || !receiver) {
			console.error("Sender and receiver must be provided");
			return;
		}
		try {
			const { exists } = await checkUsernameExists(receiver);
			console.log(exists);
			if (exists) {
				console.log("it exists");
				try {
					const response = await fetch("/api/friendRequestConnect", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ sender, receiver }),
					});

					if (!response.ok) {
						throw new Error(
							`HTTP error! status: ${response.status}`
						);
					}

					const result = await response.json();
					console.log("Friend request sent:", result);
					setReceiver(""); // Reset the receiver input after successful submission
				} catch (error) {
					console.error("Error sending friend request:", error);
				}
			} else {
				alert("username not in the system");
			}
		} catch (error) {
			console.error("Error checking username:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.addFriendForm}>
			<input
				className={styles.inputField}
				type="text"
				value={receiver}
				onChange={(e) => setReceiver(e.target.value)}
				placeholder="Receiver username"
			/>
			<button type="submit" className={styles.circle}>
				Send Friend Request
			</button>
		</form>
	);
};

export default FriendRequestForm;
