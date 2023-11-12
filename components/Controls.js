import SearchBar from "./searchBar";
import { SpottedContext } from "../components/Context";
import styles from "./controls.module.css";
import React, { useContext, useState } from "react";
import { Username } from "../components/Context";
import SettingsDropdown from "./SettingsDropdown";
import UserSection from "./UserSection";

const Controls = React.memo(function Controls({
	session,
	birdData,
	addSpot,
	isOpen,
	addUsername,
	toggleSection,
}) {
	const { username, setUsername } = useContext(Username);
	const { spotted, setSpotted } = useContext(SpottedContext);
	const [friendQueryOpen, setFriendQueryOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
	});

	const toggleFriendQuery = () => {
		setFriendQueryOpen((prevIsOn) => !prevIsOn);
		console.log(friendQueryOpen);
	};
	const closeFriendQuery = () => {
		setFriendQueryOpen(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		console.log("Handling form submission");
		e.preventDefault();

		if (formData.name.trim() !== "") {
			console.log("Calling addUsername");
			const isSuccessful = await addUsername({ username: formData.name });

			if (isSuccessful) {
				console.log("Setting username:", formData.name);
				setUsername(formData.name);
			}
		} else {
			console.error("Username is empty");
		}
	};
	const exit = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`;

	return (
		<div className={styles.section2}>
			<div
				className={`${styles.userInformation} ${
					isOpen.userSection ? styles.open : ""
				}`}
			>
				<UserSection
					isOpen={isOpen}
					toggleSection={toggleSection}
					session={session}
					toggleFriendQuery={toggleFriendQuery}
					handleSubmit={handleSubmit}
					handleChange={handleChange}
					formData={formData}
					friendQueryOpen={friendQueryOpen}
					closeFriendQuery={closeFriendQuery}
				/>
			</div>
			<div className={styles.topBar}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					onClick={() => toggleSection("userSection")}
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.iconButton}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>

				<SettingsDropdown />
			</div>
			<div className={styles.container}>
				<div
					className={`${styles.containerHeader1} ${
						isOpen.searchSection ? styles.open : ""
					}`}
				>
					<h1>Recent Spots</h1>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={styles.dropdownIcon}
						onClick={() => toggleSection("gridContainer")}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d={
								isOpen.gridContainer
									? "M4.5 15.75l7.5-7.5 7.5 7.5"
									: "M19.5 8.25l-7.5 7.5-7.5-7.5"
							}
						/>
					</svg>
				</div>

				<div
					className={`${styles.gridContainer} ${
						isOpen.gridContainer ? styles.open : ""
					}`}
				>
					{spotted
						.filter((bird) => bird)
						.slice(0, 16)
						.map((bird, index) => (
							<div className={styles.birdGridItem} key={index}>
								{bird.birdName}
							</div>
						))}
				</div>
			</div>
			<div className={styles.container}>
				<div
					className={`${styles.containerHeader2} ${
						isOpen.gridContainer ? styles.open : ""
					}`}
				>
					<h1>Add Spot</h1>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={styles.dropdownIcon}
						onClick={() => toggleSection("searchSection")}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d={
								isOpen.searchSection
									? "M4.5 15.75l7.5-7.5 7.5 7.5"
									: "M19.5 8.25l-7.5 7.5-7.5-7.5"
							}
						/>
					</svg>
				</div>{" "}
				<div
					className={`${styles.searchSection} ${
						isOpen.searchSection ? styles.open : ""
					}`}
				>
					<SearchBar birdData={birdData} addSpot={addSpot} />
				</div>
			</div>
		</div>
	);
});
export default Controls;
