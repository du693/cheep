import React, { createContext, useState } from "react";

export const SpottedContext = createContext();

export const CoordinatesContext = createContext();

export const Username = createContext();

export const UserContext = createContext();

export function SpottedProvider({ children }) {
	const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
	const [spotted, setSpotted] = useState([]);
	const [username, setUsername] = useState(null);
	const [userObject, setUserObject] = useState({});

	return (
		<UserContext.Provider value={{ userObject, setUserObject }}>
			<Username.Provider value={{ username, setUsername }}>
				<CoordinatesContext.Provider
					value={{ coordinates, setCoordinates }}
				>
					<SpottedContext.Provider value={{ spotted, setSpotted }}>
						{children}
					</SpottedContext.Provider>
				</CoordinatesContext.Provider>
			</Username.Provider>
		</UserContext.Provider>
	);
}
