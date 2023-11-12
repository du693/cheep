import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useState, useContext, useRef, memo } from "react";
import { CoordinatesContext } from "../components/Context";
import { SpottedContext } from "../components/Context";
import fetchDatData from "../pages/api/fetchGlobalSpots";
import styles from "./mapstyles.module.css";
import formatCuteDate from "@/utils/formatCuteDate";

import {
	MarkerClusterer,
	SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { exit } from "@/public/svgList";

const MapComponent = ({ onMapLoaded, globalIsOn, handleMapPending }) => {
	const [hasRunEffect, setHasRunEffect] = useState(false);
	const [selectedBird, setSelectedBird] = useState(null);
	const { setCoordinates } = useContext(CoordinatesContext);
	const [globalSpots, setGlobalSpots] = useState([]);
	const { spotted } = useContext(SpottedContext);
	const [locationPermission, setLocationPermission] = useState("pending");
	const [userLocationAvailable, setUserLocationAvailable] = useState(false);
	const [userLocation, setUserLocation] = useState({
		lat: null,
		lng: null,
	});
	const [didAttemptSetFromUserLocation, setDidAttemptSetFromUserLocation] =
		useState(false);
	const markersRef = useRef([]);
	const clustererRef = useRef(null);
	const mapRef = useRef(null);
	const mapInstanceRef = useRef(null);

	const loader = new Loader({
		apiKey: "AIzaSyBftZDKjeyouvIH3w0kl_1DvZYMBBmDEcg",
		version: "weekly",
	});
	let previousMarker = null;

	//This is an important first step upon getting location permissions. once we get location we can determine to initMap to that location. Do not initMap before userLocation is filled.

	//maybe think about putting this at beginning of index.js?? this needs to run ASAP
	//also if location perms are denied do not load map. (give an option that allows client to switch)
	async function getGeoLocation() {
		let locationTimeout;
		if (navigator.geolocation) {
			locationTimeout = setTimeout(() => {
				if (locationPermission === "pending") {
					console.log("Location request timed out.");
					setLocationPermission("timeout");
					handleMapPending();
				}
			});
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log(
						"Successfully fetched geolocation:",
						position.coords
					);
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});

					setLocationPermission("granted");
					getLocation();

					setUserLocationAvailable(true);
					onMapLoaded();
				},
				(error) => {
					clearTimeout(locationTimeout);
					console.log("Error fetching geolocation:", error);
					setLocationPermission("denied");
				}
			);
		} else {
			console.log("Geolocation is not supported by this browser.");
			setLocationPermission("unsupported");
		}
		return () => clearTimeout(locationTimeout);
	}

	//this should only run once
	useEffect(() => {
		getGeoLocation();
	}, []);

	//the getLocation function is for getting the location for both the userIcon and click event/icon.
	async function getLocation(e) {
		const { Marker } = await loader.importLibrary("marker");
		if (e) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			setCoordinates({ lat, lng });

			const newMarker = new Marker({
				position: {
					lat: parseFloat(lat),
					lng: parseFloat(lng),
				},
				icon: {
					scaledSize: new window.google.maps.Size(15, 25),
					url: `/clickMarker.png`,
				},
				title: "User Location",
				map: mapInstanceRef.current,
				optimized: false,
			});

			//ensures only one clickIcon at a time
			if (previousMarker) {
				previousMarker.setMap(null);
			}
			previousMarker = newMarker;
			//this is actually for an entirely different marker, slightly clever if theres no event and userLocation is filled then place userIcon at location
			//below will not execute if there is an event
		} else if (userLocation.lat !== null && userLocation.lng !== null) {
			setCoordinates({
				lat: userLocation.lat,
				lng: userLocation.lng,
			});
			new Marker({
				position: {
					lat: parseFloat(userLocation.lat),
					lng: parseFloat(userLocation.lng),
				},

				icon: {
					scaledSize: new window.google.maps.Size(30, 30),
					url: `/selfIndicator.png`,
				},
				title: "User Location",

				map: mapInstanceRef.current,
				zIndex: 10,
			});
			setDidAttemptSetFromUserLocation(true);
		}
	}

	useEffect(() => {
		if (globalIsOn && !hasRunEffect) {
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
	}, [globalIsOn]);

	useEffect(() => {
		if (userLocation.lat !== null && userLocation.lng !== null) {
			getLocation();
		}
	}, [userLocationAvailable]);

	useEffect(() => {
		const initMap = async () => {
			const { Map } = await loader.importLibrary("maps");

			const center =
				userLocation.lat && userLocation.lng
					? userLocation
					: { lat: -3.745, lng: -38.523 };

			const mapOptions = (google.maps.mapOptions = {
				center: center,
				zoom: 12.5,
				maxZoom: 16,
				minZoom: 8,
				mapId: "68d7d2e243f0235a",
				disableDefaultUI: true,
				scrollwheel: true,
				draggable: true,
			});

			mapInstanceRef.current = new Map(mapRef.current, mapOptions);
		};
		if (userLocationAvailable) {
			initMap();
		} else {
			console.log("pending");
		}
	}, [userLocationAvailable]);

	useEffect(() => {
		const initMarkers = async () => {
			const { Marker } = await loader.importLibrary("marker");
			const renderer = {
				render: ({ count, position }) =>
					new Marker({
						label: {
							text: String(count),
							fontFamily: "Helvetica",
							color: "white",
							fontSize: "8px",
							marginBottom: "50px",
						},
						position,
						icon: {
							scaledSize: new window.google.maps.Size(40, 30),
							url: `/clusterIcon.png`,
							labelOrigin: new google.maps.Point(20, 25),
						},
					}),
			};

			const createMarkers = (spots, map) => {
				const newMarkers = spots.filter(Boolean).map((spot, key) => {
					if (!globalIsOn) {
						const marker = new Marker({
							key: key,
							icon: {
								url: `/svgIcon.png`,
								scaledSize: new google.maps.Size(30, 30),
							},
							position: {
								lat: parseFloat(spot.lat),
								lng: parseFloat(spot.lng),
							},
							map: map,
						});
						const infoWindowContent = `<div style="color: black; padding: 0; margin: 0;"><div style="width: 25px; position: absolute; top: 0; right: 0;">${exit}</div><strong>${
							spot.birdName
						}</strong><br>${formatCuteDate(
							spot.timeSpotted
						)}</div>`;

						// Create an InfoWindow
						const infoWindow = new google.maps.InfoWindow({
							content: infoWindowContent,
						});

						// Add click event listener to the marker
						marker.addListener("click", () => {
							// Close any previously open InfoWindows
							if (window.currentOpenInfoWindow) {
								window.currentOpenInfoWindow.close();
							}

							// Open the InfoWindow on the current marker
							infoWindow.open({
								anchor: marker,
								map,
								shouldFocus: false,
							});

							// Store the currently open InfoWindow
							window.currentOpenInfoWindow = infoWindow;
						});
						return marker;
					}
					if (globalIsOn) {
						const marker = new Marker({
							key: key,
							icon: {
								url: `/svgIcon.png`,
								scaledSize: new google.maps.Size(30, 30),
							},
							position: {
								lat: parseFloat(spot.spotted.lat),
								lng: parseFloat(spot.spotted.lng),
							},
							map: map,
						});
						const infoWindowContent = `<div style="color: black; "><div style="width: 25px; position: absolute; top: 0; right: 0;">${exit}</div><strong>${
							spot.username
						}</strong><br>${formatCuteDate(spot.timeSpotted)}<br>${
							spot.spotted.birdName
						}</div>`;

						// Create an InfoWindow
						const infoWindow = new google.maps.InfoWindow({
							content: infoWindowContent,
						});

						// Add click event listener to the marker
						marker.addListener("click", () => {
							// Close any previously open InfoWindows
							if (window.currentOpenInfoWindow) {
								window.currentOpenInfoWindow.close();
							}

							// Open the InfoWindow on the current marker
							infoWindow.open({
								anchor: marker,
								map,
								shouldFocus: false,
							});

							// Store the currently open InfoWindow
							window.currentOpenInfoWindow = infoWindow;
						});
						return marker;
					}
				});

				// Here we are updating the markersRef with the new markers
				markersRef.current.push(...newMarkers);

				return newMarkers;
			};
			const algorithm = new SuperClusterAlgorithm({
				radius: 40,
			});
			// Function to remove all markers
			const clearMarkers = () => {
				for (const marker of markersRef.current) {
					marker.setMap(null); // Removes the marker from the map
				}
				markersRef.current = []; // Clear the array
			};

			const clearMarkerClusterer = () => {
				if (clustererRef.current) {
					clustererRef.current.clearMarkers();
				}
			};

			if (globalIsOn) {
				// If globalIsOn, remove the existing markers and create new ones
				clearMarkers();
				clearMarkerClusterer();

				markersRef.current = createMarkers(
					globalSpots.map((spot) => spot),
					mapInstanceRef.current
				);
				clustererRef.current = new MarkerClusterer({
					map: mapInstanceRef.current,
					markers: markersRef.current, // Use newMarkers instead of markersRef.current
					renderer: renderer,
					algorithm: algorithm,
				});
			}
			if (!globalIsOn) {
				// If globalIsOff, just remove the existing markers
				clearMarkers();
				clearMarkerClusterer();

				markersRef.current = createMarkers(
					spotted,
					mapInstanceRef.current
				);
				clustererRef.current = new MarkerClusterer({
					map: mapInstanceRef.current,
					markers: markersRef.current, // Use newMarkers instead of markersRef.current
					renderer: renderer,
					algorithm: algorithm,
				});
			}

			const clickListener = mapInstanceRef.current.addListener(
				"click",
				(e) => {
					getLocation(e);
				}
			);

			return () => {
				google.maps.event.removeListener(clickListener);
			};
		};
		if (userLocationAvailable) {
			initMarkers();
		}
	}, [spotted, globalSpots, globalIsOn]);

	const handleRecenter = () => {
		if (userLocation && mapInstanceRef.current) {
			mapInstanceRef.current.panTo(userLocation);
		}
	};

	return (
		<>
			<div className="circle"></div>
			<div className={styles.map} ref={mapRef}></div>
			<div className={styles.target}>
				<svg
					onClick={handleRecenter}
					xmlns="http://www.w3.org/2000/svg"
					version="1"
					viewBox="0 0 24 24"
					enableBackground="new 0 0 24 24"
				>
					<path d="M 11 1 L 11 3.03125 C 6.7956596 3.4828018 3.4828018 6.7956596 3.03125 11 L 1 11 L 1 13 L 3.03125 13 C 3.4828018 17.20434 6.7956596 20.517198 11 20.96875 L 11 23 L 13 23 L 13 20.96875 C 17.20434 20.517198 20.517198 17.20434 20.96875 13 L 23 13 L 23 11 L 20.96875 11 C 20.517198 6.7956596 17.20434 3.4828018 13 3.03125 L 13 1 L 11 1 z M 12 5 C 15.9 5 19 8.1 19 12 C 19 15.9 15.9 19 12 19 C 8.1 19 5 15.9 5 12 C 5 8.1 8.1 5 12 5 z M 12 8 C 9.790861 8 8 9.790861 8 12 C 8 14.209139 9.790861 16 12 16 C 14.209139 16 16 14.209139 16 12 C 16 9.790861 14.209139 8 12 8 z" />
				</svg>
			</div>
		</>
	);
};

export default memo(MapComponent);
