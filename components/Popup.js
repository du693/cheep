import React, { useContext, useState } from "react";
import styles from "./popup.module.css";
import { Username } from "./Context";

const Popup = ({ isOpen, onClose, addUsername }) => {
	const { username, setUsername } = useContext(Username);

	const [formData, setFormData] = useState({
		name: "",
	});

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

		onClose();
	};

	return isOpen ? (
		<div className={styles.popupOverlay}>
			<div className={styles.popupContent}>
				<button className={styles.closeButton} onClick={onClose}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={styles.xClose}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<h2>Enter Username</h2>
				<form className={styles.usernameForm} onSubmit={handleSubmit}>
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
					<button type="submit" className={styles.submitUsername}>
						Submit
					</button>
				</form>
			</div>
		</div>
	) : null;
};

export default Popup;
