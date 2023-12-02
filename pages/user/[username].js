import { SpottedContext, Username } from "@/context/Context";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import styles from "@/styles/user.module.css";
import Image from "next/image";
import FriendRequestForm from "@/components/Controls/SendFriendReq";
import FriendRequests from "@/components/Controls/CurrentRequests";
import formatDate from "@/utils/dateConversions";

export default function UserPage() {
	const { username } = useContext(Username);
	const router = useRouter();
	const { data: session, status } = useSession();
	const [friendQueryOpen, setFriendQueryOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: "",
	});
	const [loading, setLoading] = useState(false);
	const [localUsername, setLocalUsername] = useState();
	const [friends, setFriends] = useState([]);
	const { spotted, setSpotted } = useContext(SpottedContext);

	const handleReturnClick = () => {
		router.push(`/dashboard`);
	};
	useEffect(() => {
		if (username !== null) {
			localStorage.setItem("username", username);
		}
	}, [username]);

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setLocalUsername(storedUsername);
		}
		setIsLoading(false);
	}, [username]);

	useEffect(() => {
		// Function to fetch friends data
		async function fetchFriends() {
			if (routerUsername) {
				setLoading(true);
				try {
					const response = await fetch(
						`/api/getFriendsList?username=${routerUsername}`
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

		// Call the fetch function
		fetchFriends();
	}, []);

	const toggleFriendQuery = () => {
		setFriendQueryOpen((prevIsOn) => !prevIsOn);
		console.log(friendQueryOpen);
	};
	const closeFriendQuery = () => {
		setFriendQueryOpen(false);
	};

	// Check if the router is ready
	if (!router.isReady) {
		return <div>Loading...</div>; // Or any other loading state
	}

	const routerUsername = router.query.username; // Assuming the dynamic segment is named 'username'
	console.log(
		"localUsername, routerUsername:",
		localUsername,
		routerUsername
	);
	if (isLoading) {
		return <div>Loading...</div>; // Show loading indicator
	}
	return localUsername === routerUsername ? (
		<div className={styles.userpage}>
			<div
				className={styles.absoluteExit}
				onClick={() => handleReturnClick()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
					/>
				</svg>
			</div>
			<div className={styles.bubble}>
				<div className={styles.userProfile}>
					<Image
						className={styles.sessionImage}
						src={session.user.image}
						alt="User Profile"
						width={50}
						height={50}
						onClick={() => handleUserSectionClick()}
					/>
					<div>
						<h1>jkuhl99</h1>
						<p>total spots: 6</p>
						<p>total friends: 3</p>
					</div>
				</div>
			</div>
			<div className={styles.bubble}>
				<div className={styles.userFriends}>
					{" "}
					<div className={styles.addFriendForm}>
						<div className={styles.stat2}>
							<h2>
								<u>Friends</u>
							</h2>
							<div>
								{" "}
								{friends
									.filter((user) => user)

									.map((user, index) => (
										<tr
											className={styles.listItem}
											key={index}
										>
											<td className={styles.birdName}>
												{user.username}
											</td>
										</tr>
									))}
							</div>
						</div>
						<div className={styles.friendRequests}>
							<FriendRequests />
						</div>
						<div className={styles.addFriend}>
							<FriendRequestForm username={username} />
						</div>
					</div>
				</div>
				<div className={styles.userSpots}>
					<div className={styles.spottedGridDiv}>
						<table className={styles.spottedGrid}>
							<thead className={styles.tableHead}>
								<tr>
									<td>Bird Name</td>
									<td>Time Spotted</td>
									<td>Notes</td>
								</tr>
							</thead>
							<tbody className={styles.daBody}>
								{spotted
									.filter((bird) => bird)
									.map((bird, index) => (
										<tr
											className={styles.birdListItem}
											key={index}
										>
											<td className={styles.birdName}>
												{bird.birdName}
											</td>
											<td className={styles.spotDate}>
												{formatDate(bird.timeSpotted)}
											</td>
											<td className={styles.spotDate}>
												{bird.description}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className={styles.incorrectUser}>
			Please log into the correct account. Router Username:{" "}
			{routerUsername}
		</div>
	);
}
export async function getServerSideProps(context) {
	let session;

	try {
		session = await getSession(context);
		console.log("Analyzing session:", session);
		console.log(session);
	} catch (error) {
		console.error("Error getting session:", error);
		// Handle the error appropriately
		// For example, you can log the error and continue with null
		session = null;
	}
	if (!session) {
		return {
			redirect: {
				destination: "/", // Redirect unauthenticated users to your access page
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
}
