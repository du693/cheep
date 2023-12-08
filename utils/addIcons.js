export const preLoadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			img.onerror = reject;
			img.src = url;
		};
	});
};

export const preloadImages = (imageUrls) => {
	const preloadPromises = imageUrls.map(preLoadImage);
	return Promise.all(preloadPromises).then((images) => {
		return images.reduce((obj, src, index) => {
			obj[imageUrls[index]] = src;
			return obj;
		}, {});
	});
};
