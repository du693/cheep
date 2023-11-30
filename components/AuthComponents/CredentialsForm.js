"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./credentialsForm.module.css";

export function CredentialsForm() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [action, setAction] = useState("login"); // 'login' or 'signup'

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		if (action === "signup") {
		} else {
			// Handle login logic
			const signInResponse = await signIn("credentials", {
				email: data.get("email"),
				password: data.get("password"),
				redirect: false,
			});

			if (signInResponse && !signInResponse.error) {
				router.push("/"); // Redirect to homepage
			} else {
				console.log("Error: ", signInResponse);
				setError("Your Email or Password is wrong!");
			}
		}
	};

	return (
		<form className={styles.credentialsForm} onSubmit={handleSubmit}>
			{error && <span>{error}</span>}
			<input type="email" name="email" placeholder="Email" required />
			<input
				type="password"
				name="password"
				placeholder="Password"
				required
			/>

			<button type="submit" onClick={() => setAction("login")}>
				Log in
			</button>
			<button type="submit" onClick={() => setAction("signup")}>
				Sign up
			</button>
		</form>
	);
}
