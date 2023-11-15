import { useState, useEffect, useContext } from "react";
import { Username } from "@/context/Context";

function FriendsList() {
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { username } = useContext(Username);

	useEffect(() => {
		async function fetchFriends() {
			setLoading(true);
			if (username !== null) {
				try {
					const response = await fetch(
						`/api/getFriendsList?username=${username}`
					);
					if (!response.ok) {
						throw new Error(
							`HTTP error! status: ${response.status}`
						);
					}
					const data = await response.json();
					setFriends(data.friends);
				} catch (e) {
					setError(e.message);
				} finally {
					setLoading(false);
				}
			}
		}

		fetchFriends();
	}, [username]);

	return <div>{friends.length}</div>;
}

export default FriendsList;
