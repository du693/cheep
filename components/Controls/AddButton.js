import styles from "./addbutton.module.css";
import { motion } from "framer-motion";

export default function AddButton({ onClick }) {
	const pulseVariants = {
		rest: {
			scale: 1,
		},
		hover: {
			scale: 1.05,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
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
