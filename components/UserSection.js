import { useContext, useState, useEffect } from "react";
import { SpottedContext, Username } from "./Context";
import FriendsList from "./FriendsList";
import FriendRequests from "./CurrentRequests";
import styles from "./usersection.module.css";
import FriendRequestForm from "./SendFriendReq";
import Image from "next/image";
import formatDate from "@/utils/dateConversions";

export default function UserSection({
	toggleSection,
	session,
	toggleFriendQuery,
	handleSubmit,
	handleChange,
	formData,
	friendQueryOpen,
	closeFriendQuery,
	isOpen,
}) {
	const { username, setUsername } = useContext(Username);
	const { spotted, setSpotted } = useContext(SpottedContext);
	const [friends, setFriends] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Function to fetch friends data
		async function fetchFriends() {
			if (username) {
				setLoading(true);
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

		// Call the fetch function
		fetchFriends();
	}, [username]);

	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				onClick={() => {
					toggleSection("userSection");
					closeFriendQuery();
				}}
				stroke="currentColor"
				className={styles.exitUserInfo}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
			<div className={styles.user}>
				{!username ? (
					<div className={styles.signUpSection}>
						<h2>Create a username to access</h2>
						<form
							className={styles.usernameForm}
							onSubmit={handleSubmit}
						>
							<div>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									placeholder="Username"
									className={styles.inputField}
									onChange={handleChange}
									required
								/>
							</div>
							<button
								type="submit"
								className={styles.submitUsername}
							>
								Submit
							</button>
						</form>
					</div>
				) : (
					<div className={styles.user}>
						<div className={styles.userHeader}>
							<div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.addFriend}
									onClick={() => toggleFriendQuery()}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
									/>
								</svg>
							</div>
							<div className={styles.userSummary}>
								<h1>{username} </h1>
								<Image
									className={styles.sessionImage}
									src={session.user.image}
									alt="User Profile"
									width={40}
									height={40}
								/>
							</div>
						</div>

						<div
							className={`${styles.addFriendForm} ${
								friendQueryOpen ? styles.show : ""
							}`}
						>
							<FriendRequestForm username={username} />
						</div>
						<div className={styles.userStats}>
							<div className={styles.statHeader}>
								<h1>Total Spots: {spotted.length}</h1>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.dropdownIcon}
									onClick={() =>
										toggleSection("spotCountSection")
									}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={
											isOpen.spotCountSection
												? "M4.5 15.75l7.5-7.5 7.5 7.5"
												: "M19.5 8.25l-7.5 7.5-7.5-7.5"
										}
									/>
								</svg>
							</div>
							<div
								className={`${styles.stat1} ${
									isOpen.spotCountSection ? styles.open : ""
								}`}
							>
								<table className={styles.spottedGrid}>
									<thead className={styles.tableHead}>
										<tr>
											<th>Bird Name</th>
											<th>Time Spotted</th>
										</tr>
									</thead>
									<tbody>
										{spotted
											.filter((bird) => bird)

											.map((bird, index) => (
												<tr
													className={
														styles.birdListItem
													}
													key={index}
												>
													<td
														className={
															styles.birdName
														}
													>
														{bird.birdName}
													</td>
													<td
														className={
															styles.spotDate
														}
													>
														{formatDate(
															bird.timeSpotted
														)}
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>

						<div className={styles.userStats}>
							<div className={styles.statHeader}>
								<h1>Friends: {friends.length}</h1>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.dropdownIcon}
									onClick={() =>
										toggleSection("friendListSection")
									}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={
											isOpen.friendListSection
												? "M4.5 15.75l7.5-7.5 7.5 7.5"
												: "M19.5 8.25l-7.5 7.5-7.5-7.5"
										}
									/>
								</svg>
							</div>
							<div
								className={`${styles.stat2} ${
									isOpen.friendListSection ? styles.open : ""
								}`}
							>
								<div>
									{" "}
									{friends
										.filter((user) => user)

										.map((user, index) => (
											<tr
												className={styles.birdListItem}
												key={index}
											>
												<td className={styles.birdName}>
													{user.username}
												</td>
											</tr>
										))}
								</div>
							</div>
						</div>
						<div className={styles.userStats}>
							<div className={styles.statHeader}>
								<h1>Achievements: ?</h1>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.dropdownIcon}
									onClick={() =>
										toggleSection("achievementSection")
									}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d={
											isOpen.achievementSection
												? "M4.5 15.75l7.5-7.5 7.5 7.5"
												: "M19.5 8.25l-7.5 7.5-7.5-7.5"
										}
									/>
								</svg>
							</div>
							<div
								className={`${styles.stat3} ${
									isOpen.achievementSection ? styles.open : ""
								}`}
							>
								<div>Achievements coming soon</div>
							</div>
						</div>
						<FriendRequests />
					</div>
				)}
			</div>
		</>
	);
}
