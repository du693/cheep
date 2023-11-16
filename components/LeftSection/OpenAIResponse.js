import styles from "./openairesponse.module.css";
import openAI from "@/public/openAI.svg";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
export default function OpenAIResponse() {
	return (
		<div className={styles.OpenAIResponse}>
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
					<TypeAnimation
						cursor={true}
						sequence={[
							"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", // Message you want to type out
							1000, // Pause duration in milliseconds
						]}
						wrapper="div" // or 'span', 'p', etc.
						repeat={1} // Repeat this number of times (Infinity for infinite loop)
					/>
				</div>
			</div>
		</div>
	);
}
