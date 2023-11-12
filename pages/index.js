import { fetchBirdNames } from "./api/fetchBirds";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useContext, useState, useCallback, Suspense } from "react";
import styles from "../styles/Home.module.css";
import MapComponent from "@/components/map";
import { SpottedContext } from "../components/Context";
import React from "react";
import Controls from "@/components/Controls";
import AccessPage from "@/components/AccessPage";
import { Username } from "../components/Context";
import Absolutes from "@/components/Absolutes";
import { UserContext } from "../components/Context";
import { addSpot } from "@/services/addspot";
import updateUsername from "./api/updateUsername";
import dynamic from "next/dynamic";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function Home({ birdNames }) {
	const [globalIsOn, setGlobalIsOn] = useState(false);
	const [isMapLoaded, setMapLoaded] = useState(false);
	const { data: session } = useSession();
	const { spotted, setSpotted } = useContext(SpottedContext);
	const { userObject, setUserObject } = useContext(UserContext);
	const { username, setUsername } = useContext(Username);
	const [isOpen, setIsOpen] = useState({
		gridContainer: false,
		searchSection: false,
		userSection: false,
		friendListSection: false,
		spotCountSection: false,
		achievementSection: false,
	});

	const toggleSwitch = () => {
		setGlobalIsOn((prevIsOn) => !prevIsOn);
		console.log("toggled");
	};

	const handleMapLoaded = useCallback((loaded) => {
		setMapLoaded(true);
	}, []);

	const handleMapPending = useCallback((loaded) => {
		setMapLoaded(false);
	}, []);

	const toggleSection = (section) => {
		setIsOpen((prevState) => ({
			...prevState,
			[section]: !prevState[section],
		}));
	};

	const openSection = (section) => {
		setIsOpen((prevState) => ({
			...prevState,
			[section]: true,
		}));
	};

	const handleAddSpot = useCallback(
		async (spotData) => {
			await addSpot({
				...spotData,
				session: session,
				username: username,
				setSpotted: setSpotted,
				spotted: spotted,
			});
		},
		[session, username, setSpotted]
	);

	const addUsername = useCallback(
		async (user) => {
			if (!session || !session.user || !user) {
				console.error("Session not found or username is null");
				return false;
			}

			try {
				await updateUsername(session.user.email, user);
				setUsername(user); // Update the username in your context if needed
				return true;
			} catch (error) {
				alert(error.message);
				return false;
			}
		},
		[session, setUsername]
	);

	useEffect(() => {
		console.log("fetch request rerendered");
		if (session && session.user) {
			fetch(
				`/api/updateUser?userId=${encodeURIComponent(
					session.user.email
				)}`
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((data) => {
					setUserObject(data);
					setSpotted(data.spotted);
					setUsername(data.username);
				})
				.catch((error) => {
					console.error(
						"There was a problem with the fetch operation:",
						error
					);
				});
		}
	}, [isMapLoaded]);

	return (
		<>
			{session && session.user ? (
				<>
					<Absolutes
						openSection={openSection}
						globalIsOn={globalIsOn}
						toggleSwitch={toggleSwitch}
					/>

					<div className={styles.section}>
						<MapComponent
							handleMapPending={handleMapPending}
							globalIsOn={globalIsOn}
							onMapLoaded={handleMapLoaded}
							className={styles.mapping}
						/>
						<Controls
							session={session}
							isOpen={isOpen}
							toggleSection={toggleSection}
							birdData={birdNames}
							addSpot={handleAddSpot}
							addUsername={addUsername}
							className={styles.controlling}
						></Controls>
					</div>
				</>
			) : (
				<AccessPage />
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	const birdNames = await fetchBirdNames();
	const session = await getSession(context);

	return {
		props: {
			birdNames,
			session,
		},
	};
}
