import { SpottedContext, Username } from "@/context/Context";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "@/styles/user.module.css";
import Image from "next/image";
import FriendRequestForm from "@/components/UserPage/SendFriendReq";
import FriendRequests from "@/components/UserPage/CurrentRequests";
import formatDate from "@/utils/dateConversions";
import fetchDatData from "@/pages/api/fetchGlobalSpots";
import formatCuteDate from "@/utils/formatCuteDate";

export default function UserComponent() {
	const { username } = useContext(Username);
	const [hasRunEffect, setHasRunEffect] = useState(false);
	const [globalSpots, setGlobalSpots] = useState([]);
	const router = useRouter();
	const { data: session, status } = useSession();
	const [friendQueryOpen, setFriendQueryOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [localUsername, setLocalUsername] = useState();
	const [friends, setFriends] = useState([]);
	const { spotted, setSpotted } = useContext(SpottedContext);
	const [error, setError] = useState();
	const [isOpen, setIsOpen] = useState({
		userSection: true,
		friendFeed: false,
		globalFeed: false,
	});

	const toggleSection = (sectionToOpen) => {
		setIsOpen((prevState) => {
			const updatedState = {};

			// Close all sections except the one to open
			for (const section in prevState) {
				updatedState[section] = section === sectionToOpen;
			}

			return updatedState;
		});
	};

	const handleReturnClick = () => {
		router.push(`/dashboard`);
	};
	useEffect(() => {
		if (username !== null) {
			localStorage.setItem("username", username);
		}
	}, [username]);
	useEffect(() => {
		if (isOpen.globalFeed && !hasRunEffect) {
			console.log("global fetching");
			fetchDatData()
				.then((data) => {
					if (
						data &&
						data.globalSpots &&
						Array.isArray(data.globalSpots)
					) {
						const uniqueSpots = data.globalSpots.filter(
							(spot) =>
								!globalSpots.some(
									(existingSpot) =>
										existingSpot.lat === spot.lat
								)
						);

						setGlobalSpots((prevGlobalSpots) => [
							...prevGlobalSpots,
							...uniqueSpots,
						]);
						setHasRunEffect(true);
					}
				})
				.catch((error) => {
					console.error("Error fetching global spots:", error);
				});
		}
	}, [isOpen]);

	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setLocalUsername(storedUsername);
		}
		setIsLoading(false);
	}, [username]);

	useEffect(() => {
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
		fetchFriends();
	}, []);

	const toggleFriendQuery = () => {
		setFriendQueryOpen((prevIsOn) => !prevIsOn);
		console.log(friendQueryOpen);
	};
	const closeFriendQuery = () => {
		setFriendQueryOpen(false);
	};

	if (!router.isReady) {
		return <div>Loading...</div>;
	}

	const routerUsername = router.query.username;
	console.log(
		"localUsername, routerUsername:",
		localUsername,
		routerUsername
	);
	if (isLoading) {
		return <div>Loading...</div>;
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
				<div className={styles.leftBubble}>
					<div className={styles.sectionHeader}>
						<header>
							<h1
								onClick={() => {
									toggleSection("userSection");
								}}
							>
								User
							</h1>
							<h1
								onClick={() => {
									toggleSection("friendFeed");
								}}
							>
								Friend Feed
							</h1>
							<h1
								onClick={() => {
									toggleSection("globalFeed");
								}}
							>
								Global Feed
							</h1>
						</header>
					</div>
					<div className={styles.leftBubbleToggledSection}>
						{isOpen.userSection && (
							<div className={styles.userSection}>
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
						)}
						{isOpen.friendFeed && (
							<div className={styles.friendFeed}>
								<div>
									<ul>
										<li>Friend Feed Here</li>
									</ul>
								</div>
							</div>
						)}
						{isOpen.globalFeed && (
							<div className={styles.friendFeed}>
								<div>
									<ul>
										{globalSpots.map((spot, index) => (
											<li key={index}>
												Latitude:{" "}
												{spot.spotted.birdName},
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
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
