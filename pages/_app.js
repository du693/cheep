import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { SpottedProvider } from "../components/Context";
import Head from "next/head";

export default function App({ Component, pageProps }) {
	return (
		<>
			<SessionProvider session={pageProps.session}>
				<Head>
					<title>Cheep Bird Watching</title>
					<meta
						name="description"
						content="Explore the birds in your area and contribute to a growing community of observers with this map based bird watching app."
					/>
					{/* Other meta tags */}
				</Head>

				<SpottedProvider>
					<Component {...pageProps} />
				</SpottedProvider>
			</SessionProvider>
		</>
	);
}
