import styles from "./addbutton.module.css";
import { motion } from "framer-motion";

export default function AddButton({ onClick }) {
	const pulseVariants = {
		rest: {
			scale: 1,
		},
		hover: {
			scale: 1.05, // Adjust as needed
			transition: {
				duration: 0.3, // Adjust duration as needed
				ease: "easeInOut", // Smooth pulse effect
			},
		},
	};

	return (
		<motion.button
			variants={pulseVariants}
			initial="rest"
			whileHover="hover"
			className={styles.circle}
			onClick={onClick}
		>
			Add
		</motion.button>
	);
}
