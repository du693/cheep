import styles from "../styles/Home.module.css";
import Image from "next/image";
import { fetchBirdNames } from "./api/fetchBirds";
import updateUsername from "./api/updateUsername";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useContext, useState, useCallback } from "react";
import { Username, UserContext, SpottedContext } from "@/context/Context";
import MapComponent from "@/components/Map/map";
import { useRouter } from "next/router";
import React from "react";
import Controls from "@/components/Controls/Controls";
import crypto from "crypto";

import Absolutes from "@/components/Absolutes/Absolutes";
import Header from "@/components/Header/Header";
import BirdIdentification from "@/components/LeftSection/BirdIdentification";
import { addSpot } from "@/services/addspot";
import Cookies from "js-cookie";
import { parse } from "cookie";
import UserSection from "@/components/Controls/UserSection";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function Dashboard({ birdNames }) {
	const [globalIsOn, setGlobalIsOn] = useState(false);
	const [isMapLoaded, setMapLoaded] = useState(false);
	const { data: session, status } = useSession();
	const { spotted, setSpotted } = useContext(SpottedContext);
	const { userObject, setUserObject } = useContext(UserContext);
	const { username, setUsername } = useContext(Username);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState({
		gridContainer: false,
		searchSection: false,
		userSection: false,
		friendListSection: false,
		spotCountSection: false,
		achievementSection: false,
	});
	const [userLocation, setUserLocation] = useState({
		lat: null,
		lng: null,
	});
	Cookies.set("username", JSON.stringify(username), {
		expires: 7,
		path: "/",
	});

	const [userLocationToggle, setUserLocationToggle] = useState(false);
	const [isLocationMyLocation, setIsLocationMyLocation] = useState(false);

	const setIsLocationMyLocationFunction = (bool) => {
		setIsLocationMyLocation(bool);
	};

	const setUserLocationToggleFunction = (bool) => {
		setUserLocationToggle(bool);
	};

	const setUserLocationFunction = (lat, lng) => {
		setUserLocation(lat, lng);
	};

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
		setIsOpen((prevState) => {
			// Determine the new state for the section
			const newState = !prevState[section];

			// Log the section and its new state
			console.log(section, newState);

			// Return the updated state
			return {
				...prevState,
				[section]: newState,
			};
		});
	};

	const openSection = (section) => {
		setIsOpen((prevState) => ({
			...prevState,
			[section]: true,
		}));
	};

	console.log(username);

	useEffect(() => {
		if (status === "loading") return; // Do nothing while the session is loading
		if (!session) router.push("/");
		const usernameCookie = Cookies.get("username");
		if (
			usernameCookie === "undefined" ||
			!usernameCookie ||
			username === undefined
		) {
			router.push("/signup");
		} // Redirect to access page if not authenticated
	}, [session, status, router]);

	if (!session) {
		return null; // or a loading indicator
	}

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

	// const setCoordsToUserLocation = ()

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
			{session && session.user && (
				<>
					<div className={styles.section}>
						<div
							className={`${styles.absolutes} ${
								isOpen.userSection ? styles.show : ""
							}`}
						>
							<UserSection
								isOpen={isOpen}
								toggleSection={toggleSection}
								openSection={openSection}
								session={session}
							/>
						</div>
						<div className={styles.header}>
							<Header
								session={session}
								openSection={openSection}
								toggleSection={toggleSection}
							/>
						</div>

						{/* <div className={styles.leftSection}>
							<div className={styles.birdIdentification}>
								<BirdIdentification />
							</div>
							<div className={styles.birdResponse}>
								<OpenAIResponse />
							</div>
						</div> */}
						<div className={styles.mapSection}>
							<MapComponent
								toggleSwitch={toggleSwitch}
								setIsLocationMyLocationFunction={
									setIsLocationMyLocationFunction
								}
								isLocationMyLocation={isLocationMyLocation}
								setUserLocationFunction={
									setUserLocationFunction
								}
								userLocation={userLocation}
								userLocationToggle={userLocationToggle}
								setUserLocationToggleFunction={
									setUserLocationToggleFunction
								}
								handleMapPending={handleMapPending}
								globalIsOn={globalIsOn}
								onMapLoaded={handleMapLoaded}
								className={styles.mapping}
							/>
						</div>
						<div className={styles.rightSection}>
							<Controls
								isLocationMyLocation={isLocationMyLocation}
								userLocationToggle={userLocationToggle}
								setUserLocationToggleFunction={
									setUserLocationToggleFunction
								}
								session={session}
								isOpen={isOpen}
								toggleSection={toggleSection}
								birdData={birdNames}
								addSpot={handleAddSpot}
								addUsername={addUsername}
								className={styles.controlling}
							></Controls>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export async function getServerSideProps(context) {
	let birdNames = [];
	let session;
	const cookies = parse(context.req.headers.cookie || "");

	try {
		birdNames = await fetchBirdNames();
	} catch (error) {
		console.error("Error fetching bird names:", error);

		birdNames = [];
	}

	try {
		session = await getSession(context);
		console.log("Analyzing session:", session);
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
			birdNames,
			session,
		},
	};
}
