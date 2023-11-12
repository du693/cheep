export default function formatDate(isoString) {
	const date = new Date(isoString);
	const year = date.getFullYear().toString().slice(2); // YY
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // MM
	const day = ("0" + date.getDate()).slice(-2); // DD
	const hours = ("0" + date.getHours()).slice(-2); // HH
	const minutes = ("0" + date.getMinutes()).slice(-2); // mm
	const seconds = ("0" + date.getSeconds()).slice(-2); // ss

	return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}
