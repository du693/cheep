import styles from "./mapstyles.module.css";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useState, useContext, useRef, memo } from "react";
import { CoordinatesContext, SpottedContext } from "@/context/Context";
import fetchDatData from "@/pages/api/fetchGlobalSpots";
import formatCuteDate from "@/utils/formatCuteDate";
import { motion, spring } from "framer-motion";

import {
	Cluster,
	MarkerClusterer,
	SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { exit } from "@/public/svgList";

const MapComponent = ({
	setIsLocationMyLocationFunction,
	isLocationMyLocation,
	onMapLoaded,
	globalIsOn,
	handleMapPending,
	toggleSwitch,
	setUserLocationFunction,
	userLocation,
	userLocationToggle,
	setUserLocationToggleFunction,
}) => {
	const [hasRunEffect, setHasRunEffect] = useState(false);
	const [selectedBird, setSelectedBird] = useState(null);
	const { coordinates, setCoordinates } = useContext(CoordinatesContext);
	const [globalSpots, setGlobalSpots] = useState([]);
	const { spotted } = useContext(SpottedContext);
	const [locationPermission, setLocationPermission] = useState("pending");
	const [userLocationAvailable, setUserLocationAvailable] = useState(false);
	const [isZooming, setIsZooming] = useState(false);
	const [didAttemptSetFromUserLocation, setDidAttemptSetFromUserLocation] =
		useState(false);
	const [isMapOpen, setIsMapOpen] = useState();
	const enableMap = () => setIsMapOpen(true);
	const markersRef = useRef([]);
	const clustererRef = useRef(null);
	const mapRef = useRef(null);
	const mapInstanceRef = useRef(null);

	const loader = new Loader({
		apiKey: "AIzaSyBftZDKjeyouvIH3w0kl_1DvZYMBBmDEcg",
		version: "weekly",
	});
	let previousMarker = null;

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
					setUserLocationFunction({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					setIsLocationMyLocationFunction(true);

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

		// Remove the previous marker if it exists
		if (previousMarker) {
			previousMarker.setMap(null);
		}

		if (e) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			setCoordinates({ lat, lng });
			setIsLocationMyLocationFunction(false);

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

			// Store the new marker as the previous marker
			previousMarker = newMarker;
		} else if (userLocation.lat !== null && userLocation.lng !== null) {
			setCoordinates({
				lat: userLocation.lat,
				lng: userLocation.lng,
			});
			setIsLocationMyLocationFunction(true);
			setUserLocationToggleFunction(false);

			const newMarker = new Marker({
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

			// Store the new marker as the previous marker
			previousMarker = newMarker;

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
	}, [userLocationAvailable, userLocationToggle]);

	useEffect(() => {
		const initMap = async () => {
			const { Map } = await loader.importLibrary("maps");

			const center =
				userLocation.lat && userLocation.lng
					? userLocation
					: { lat: 42.3601, lng: -71.0589 };

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
		if (
			isMapOpen &&
			(userLocationAvailable || locationPermission === "denied")
		) {
			initMap();
		} else {
		}
	}, [locationPermission, isMapOpen]);

	useEffect(() => {
		const initMarkers = async () => {
			const { Marker } = await loader.importLibrary("marker");
			const renderer = {
				render: ({ count, position }) =>
					new Marker({
						label: {
							color: "white",
							fontSize: "8px",
							marginBottom: "50px",
						},
						position,
						icon: {
							scaledSize: new window.google.maps.Size(45, 45),
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
								url: `/newMarker.png`,
								scaledSize: new google.maps.Size(50, 50),
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
								url: `/newMarker.png`,
								scaledSize: new google.maps.Size(50, 50),
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
				if (isZooming) {
					clearMarkers();
				}
				if (!isZooming) {
					markersRef.current = createMarkers(
						globalSpots.map((spot) => spot),
						mapInstanceRef.current
					);
					clustererRef.current = new MarkerClusterer({
						onClusterClick: (event, cluster, map) => {
							let listItems = "";
							const addedSpotIds = new Set();

							if (
								cluster.markers &&
								Array.isArray(cluster.markers)
							) {
								cluster.markers.forEach((marker) => {
									const markerPosition = marker.getPosition();
									const markerLat = markerPosition.lat();
									const markerLng = markerPosition.lng();

									globalSpots.forEach((spot) => {
										if (
											Math.abs(
												spot.spotted.lat - markerLat
											) < 0.0001 &&
											Math.abs(
												spot.spotted.lng - markerLng
											) < 0.0001 &&
											!addedSpotIds.has(spot._id)
										) {
											listItems += `<li style='margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #ddd;'>
											<strong>Bird:</strong> ${spot.spotted.birdName}<br>
											<strong>Date:</strong> ${formatCuteDate(spot.timeSpotted)}
										</li>`;
											addedSpotIds.add(spot._id);
										}
									});
								});
							}

							let contentString = `<div style='max-height: 200px; overflow-y: auto; color: black;'><div style='width: 25px; position: absolute; top: 0; right: 0;'>${exit}</div>`;
							contentString +=
								"<ul style='list-style-type: none; margin: 0; padding: 0;'>";
							contentString +=
								listItems || "No matching spotted items.";
							contentString += "</ul></div>";

							const infoWindow = new google.maps.InfoWindow({
								content: contentString,
							});
							infoWindow.setPosition(cluster.position);
							infoWindow.open(map);
						},
						map: mapInstanceRef.current,
						markers: markersRef.current, // Use newMarkers instead of markersRef.current
						renderer: renderer,
						algorithm: algorithm,
					});
				}
			}
			if (!globalIsOn) {
				// If globalIsOff, just remove the existing markers
				clearMarkers();
				clearMarkerClusterer();
				if (isZooming) {
					clearMarkers();
				}
				if (!isZooming) {
					markersRef.current = createMarkers(
						spotted,
						mapInstanceRef.current
					);
					clustererRef.current = new MarkerClusterer({
						onClusterClick: (event, cluster, map) => {
							let listItems = "";
							const addedSpotIds = new Set();

							if (
								cluster.markers &&
								Array.isArray(cluster.markers)
							) {
								cluster.markers.forEach((marker) => {
									const markerPosition = marker.getPosition();
									const markerLat = markerPosition.lat();
									const markerLng = markerPosition.lng();

									spotted.forEach((spot) => {
										if (
											Math.abs(spot.lat - markerLat) <
												0.0001 &&
											Math.abs(spot.lng - markerLng) <
												0.0001 &&
											!addedSpotIds.has(spot._id)
										) {
											listItems += `<li style='margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #ddd;'>
											<strong>Bird:</strong> ${spot.birdName ? spot.birdName : "N/A"}<br>
											<strong>Date:</strong> ${
												spot.timeSpotted
													? formatCuteDate(
															spot.timeSpotted
													  )
													: "N/A"
											}
										</li>`;
											addedSpotIds.add(spot._id);
										}
									});
								});
							}

							let contentString = `<div style='max-height: 200px; overflow-y: auto; color: black;'><div style='width: 25px; position: absolute; top: 0; right: 0;'>${exit}</div>`;
							contentString +=
								"<ul style='list-style-type: none; margin: 0; padding: 0;'>";
							contentString +=
								listItems || "No matching spotted items.";
							contentString += "</ul></div>";

							const infoWindow = new google.maps.InfoWindow({
								content: contentString,
							});
							infoWindow.setPosition(cluster.position);
							infoWindow.open(map);
						},

						map: mapInstanceRef.current,
						markers: markersRef.current, // Use newMarkers instead of markersRef.current
						renderer: renderer,
						algorithm: algorithm,
					});
				}
			}

			if (mapInstanceRef.current) {
				var clickListener = mapInstanceRef.current.addListener(
					"click",
					(e) => {
						getLocation(e);
					}
				);
				mapInstanceRef.current.addListener("zoom_changed", () => {
					setIsZooming(true);
				});
				mapInstanceRef.current.addListener("idle", () => {
					setIsZooming(false);
				});
			}

			return () => {
				google.maps.event.removeListener(clickListener);
				mapInstanceRef.current.removeListener("zoom_changed");
				mapInstanceRef.current.removeListener("idle");
			};
		};
		if (userLocationAvailable || locationPermission === "denied") {
			initMarkers();
		}
	}, [
		spotted,
		globalSpots,
		globalIsOn,
		isMapOpen,
		userLocationAvailable,
		isZooming,
	]);

	const handleRecenter = () => {
		if (userLocation && mapInstanceRef.current) {
			mapInstanceRef.current.panTo(userLocation);
		}
	};

	return (
		<>
			{isMapOpen ? (
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
					<div
						className={styles.globaloruser}
						data-globalison={globalIsOn}
						onClick={toggleSwitch}
					>
						<motion.div
							className={styles.handle}
							layout
							transition={spring}
						>
							{!globalIsOn ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.user}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className={styles.user}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
									/>
								</svg>
							)}
						</motion.div>
					</div>
				</>
			) : (
				<button
					className={styles.enableMapButton}
					onClick={() => enableMap()}
				>
					Enable Map
				</button>
			)}
		</>
	);
};

export default memo(MapComponent);
