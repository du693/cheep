import styles from "@/styles/signup.module.css";
import { useCallback, useContext, useState } from "react";
import updateUsername from "./api/updateUsername";
import { Username } from "@/context/Context";
import { useSession, getSession, signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { parse } from "cookie";
import { useRouter } from "next/router";

export default function CreateUser() {
	const router = useRouter();
	const { username, setUsername } = useContext(Username);
	const [formData, setFormData] = useState({
		name: "",
	});
	const { data: session, status } = useSession();
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
				Cookies.set("username", formData.name), { expires: 7 };
				router.push("/dashboard");
			}
		} else {
			console.error("Username is empty");
		}
	};
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

	return (
		<div className={styles.user}>
			<div className={styles.signUpSection}>
				<h2>Create a username to access</h2>
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
			<button
				onClick={() => {
					signOut();
				}}
			/>
		</div>
	);
}
export async function getServerSideProps(context) {
	let session;
	const cookies = parse(context.req.headers.cookie || "");
	const username = cookies.username;

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
	if (username !== "undefined") {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
}
