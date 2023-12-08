import styles from "../styles/Home.module.css";
import Image from "next/image";
import { fetchBirdNames } from "./api/fetchBirds";
import updateUsername from "@/utils/updateUsername";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useContext, useState, useCallback } from "react";
import { Username, UserContext, SpottedContext } from "@/context/Context";
import MapComponent from "@/components/Map/map";
import { useRouter } from "next/router";
import React from "react";
import Controls from "@/components/Controls/Controls";
import Header from "@/components/Header/Header";
import { addSpot } from "@/utils/addspot";
import Cookies from "js-cookie";
import { parse } from "cookie";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function Dashboard({ birdNames }) {
	const [globalIsOn, setGlobalIsOn] = useState(false);
	const [isMapLoaded, setMapLoaded] = useState(false);
	const { data: session, status } = useSession();
	const { spotted, setSpotted } = useContext(SpottedContext);
	const { userObject, setUserObject } = useContext(UserContext);
	const { username, setUsername } = useContext(Username);
	const [userLocationToggle, setUserLocationToggle] = useState(false);
	const [isLocationMyLocation, setIsLocationMyLocation] = useState(false);
	const router = useRouter();
	const [isUsernameFilled, setIsUsernameFilled] = useState();
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
	};

	const handleMapLoaded = useCallback((loaded) => {
		setMapLoaded(true);
	}, []);

	const handleMapPending = useCallback((loaded) => {
		setMapLoaded(false);
	}, []);

	const toggleSection = (section) => {
		setIsOpen((prevState) => {
			const newState = !prevState[section];
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
	console.log("here is username", username);
	console.log("here is username state", isUsernameFilled);

	useEffect(() => {
		if (isUsernameFilled === undefined) return;
		if (isUsernameFilled) {
			localStorage.setItem("username", username);
		} else {
			localStorage.setItem("username", undefined);
		}
	}, [isUsernameFilled]);

	useEffect(() => {
		if (status === "loading") return;
		if (isUsernameFilled === undefined) return;
		const storedUsername = localStorage.getItem("username");
		console.log(storedUsername);
		if (isUsernameFilled === false) {
			console.log("should be pushing here");
			router.push("/signup");
		}
	}, [isUsernameFilled]);

	if (!session) {
		return null;
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
				setUsername(user);
				return true;
			} catch (error) {
				alert(error.message);
				return false;
			}
		},
		[session, setUsername]
	);

	useEffect(() => {
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
					if (data.username === undefined || data.username === null) {
						setIsUsernameFilled(false);
					} else {
						setIsUsernameFilled(true);
						Cookies.set("username", username);
					}
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
						></div>
						<div className={styles.header}>
							<Header
								session={session}
								openSection={openSection}
								toggleSection={toggleSection}
							/>
						</div>
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

		session = null;
	}
	if (!session) {
		return {
			redirect: {
				destination: "/",
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
