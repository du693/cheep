import styles from "./openairesponse.module.css";
import openAI from "@/public/openAI.svg";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { exit } from "../../public/svgList";
export default function OpenAIResponse({
	openAIResponse,
	clearOpenAIResponse,
	clearBirdFound,
}) {
	return (
		<div className={styles.openAIResponse}>
			<div>
				<svg
					onClick={() => {
						clearOpenAIResponse();
						clearBirdFound();
					}}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className={styles.exit}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<div className={styles.OpenAILogo}>
				<Image
					src={openAI}
					className={styles.logoPNG}
					width={200}
					priority
					alt="Logo"
				></Image>
			</div>
			<div className={styles.Lorem}>
				<div>
					{openAIResponse && (
						<TypeAnimation
							cursor={true}
							sequence={[
								openAIResponse, // Message you want to type out
								1000, // Pause duration in milliseconds
							]}
							wrapper="div" // or 'span', 'p', etc.
							repeat={1}
							speed={70} // Repeat this number of times (Infinity for infinite loop)
						/>
					)}
				</div>
			</div>
		</div>
	);
}
