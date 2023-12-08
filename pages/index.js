import { getSession } from "next-auth/react";
import AccessPage from "@/components/AccessPage/AccessPage";

export default function Home() {
	return <AccessPage />;
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (session) {
		return {
			redirect: {
				destination: "/dashboard",
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
