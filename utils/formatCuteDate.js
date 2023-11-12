export default function formatCuteDate(dateString) {
	const date = new Date(dateString);

	// Check if the date is valid
	if (isNaN(date.getTime())) {
		// Return a default message or handle the invalid date as needed
		return "Invalid date";
	}

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	};
	let formatted = new Intl.DateTimeFormat("en-US", options).format(date);

	// Add ordinal ('st', 'nd', 'rd', or 'th') to the day number
	const day = date.getDate();
	const ordinal =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";

	// Replace the day number with the day number plus ordinal and correct spacing
	formatted = formatted.replace(` ${day},`, ` ${day}${ordinal},`);

	// Only the 'AM' or 'PM' part should be in lowercase
	return formatted.replace(/AM|PM/, (match) => match.toLowerCase());
}
