import SearchBar from "./searchBar";
import styles from "./controls.module.css";
import React, { useContext, useState } from "react";
import SettingsDropdown from "./SettingsDropdown";
import UserSection from "./UserSection";
import { SpottedContext, Username } from "@/context/Context";

const Controls = React.memo(function Controls({
	isLocationMyLocation,
	session,
	birdData,
	addSpot,
	isOpen,
	addUsername,
	toggleSection,

	setUserLocationToggleFunction,
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
			<div className={styles.container}>
				<div className={styles.containerHeader2}>
					<h1>
						<u>Add a Bird Sighting</u>
					</h1>

					{/* <svg
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
					</svg> */}
				</div>
				<div className={`${styles.searchSection}`}>
					{/* ${
						isOpen.searchSection ? styles.open : ""
					} */}
					<SearchBar
						isLocationMyLocation={isLocationMyLocation}
						birdData={birdData}
						addSpot={addSpot}
						setUserLocationToggleFunction={
							setUserLocationToggleFunction
						}
					/>
				</div>
			</div>
		</div>
	);
});
export default Controls;
