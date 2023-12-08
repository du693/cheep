import { getSession } from "next-auth/react";
import UserComponent from "@/components/UserPage/UserComponent";

export default function User() {
	return <UserComponent />;
}
export async function getServerSideProps(context) {
	let session;

	try {
		session = await getSession(context);
		console.log("Analyzing session:", session);
		console.log(session);
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
			session,
		},
	};
}
