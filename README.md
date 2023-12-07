# Cheep

The idea behind Cheep is to give users the capability to document their bird sightings and view a detailed map filled with their contributions and from users all over the globe. It is intended for both casual and serious birdwatchers. Here is a quick summary of the Cheep ecosystem:

- MongoDB Backend: For data storage and management.
- NextAUTH: For security, authentification, and session management
- Google Maps API: For location and mapping functionality.
- BirdNet Audio Processor: For audio processing and recognition.
- ChatGPT API: For species' summary.

Continue with the readME for an overview of Cheep's current capabilities and insights into its development. 

While Cheep is a work in progress, I wanted to make this public as it serves as a testament to my proficiency in web development and ability to create engaging and interactive applications.

## Capabilities

### Custom MarkerClusterer onClick Event

Customizing the Marker Cluster provided in the google maps api was essential for a couple of reasons. The provided cluster click event does not solve a very fundamental problem with google maps markers: If 2 markers are placed at the same location, it is impossible to distinguish between them. The given Clusterclick event will attempt to zoom all the markers into view, but that will not work in this case. I found some solutions to this online like [this](https://github.com/jawj/OverlappingMarkerSpiderfier). which I also did not like. So I instead created my own solution that creates a google maps InfoBox on click and lists the necessary information from the clustered markers. 

Another issue I had with the given clusterClick zoom was the zooming itself. Especially with the heavily styled map, a zoom was appearing to be a costly event because of excessive tile loading, which is a big issue I have and continue to deal with. With the customized clusterClick event I was able to take one step in reducing unnecessary tile loading without giving the feeling of too much restriction to the user. Conceptually, the need for zooming was reduced. The code for the Marker Clusterer and the event are below.


```
//initialize the marker clusterer and list of marker information
clustererRef.current = new MarkerClusterer({
//removing zoom clickevent
	onClusterClick: (event, cluster, map) => {
		let listItems = "";
		const addedSpotIds = new Set();

		if (cluster.markers && Array.isArray(cluster.markers)) {
			cluster.markers.forEach((marker) => {
				const markerPosition = marker.getPosition();
				const markerLat = markerPosition.lat();
				const markerLng = markerPosition.lng();

				spotted.forEach((spot) => {
//tying the spot location to the marker that is within the cluster
					if (
						Math.abs(spot.lat - markerLat) <
							0.0001 &&
						Math.abs(spot.lng - markerLng) <
							0.0001 &&
						!addedSpotIds.has(spot._id)
					) {
						listItems += `<li style='margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #ddd;'>
							<strong>Bird:</strong> ${spot.birdName}<br>
							<strong>Date:</strong> ${formatCuteDate(spot.timeSpotted)}
						</li>`;
						addedSpotIds.add(spot._id);
					}
				});
			});
		}

		let contentString = `<div style='max-height: 200px; overflow-y: auto; color: black;'><div style='width: 25px; position: absolute; top: 0; right: 0;'>${exit}</div>`;
		contentString +=
			"<ul style='list-style-type: none; margin: 0; padding: 0;'>";
		contentString +=
			listItems || "No matching spotted items.";
		contentString += "</ul></div>";

//creating infowindow on click at cluster location with the bird info provided in scrollable list
		const infoWindow = new google.maps.InfoWindow({
			content: contentString,
		});
		infoWindow.setPosition(cluster.position);
		infoWindow.open(map);
	},
```

While the MarkerClusterer itself will do fine handling large amounts of markers. It's important to note that this algorithm's time complexity is O(n), meaning that the processing time for the list within a cluster increases linearly with the number of spots. To ensure smooth and efficient performance, especially when dealing with a large dataset, it will be important to place a cap on how many markers/spots are included in the infobox list.

### BirdNET AudioProcessor & ChatGPT

This is definitely something I was excited to work on. Bird identification can be a challenging task, so streamlining this process would be extremely important to get inexperienced birdwatchers using the app. Luckily, my friend Dan showed me the [BirdNET acoustic analyzer](https://github.com/kahst/BirdNET-Analyzer) and I knew immediately it would be very helpful for this process. Dan (you can check out his profile [here](https://github.com/dannybalentine)) also kindly agreed to host an AWS EC2 instance that accepts audio files from Cheep users and returns the result from BirdNET, along with a ChatGPT message providing a brief species summary.

Including the ChatGPT response in this API was originally intended to reduce the number of requests made in the application. However, it forcefully provides the user with the GPT response if they use BirdNET, and it will not provide them with a response if they do not. So, I plan to create a separate API route to ensure that requests are made only if the user prompts it to.

### MongoDB/Mongoose utilization

MongoDB and mongoose made my life developing cheep much easier.  I utilized mongoose for simple collection additions/modifications and to properly connect user sessions to the correct user document. All of which is held in a various encrypted MongoDB collections.

### Global Map View

Global view is a toggleable view located on the map which allows users to see every sighting spotted by other users in the past 24 hours. The time limit was set because of the potential for large quantities of markers causing excessive tile loading. Again, mongoose made my life easy by allowing a simple command ```expires: 60 * 60 * 24,``` to the globalSpot schema, and it automatically removes itself from the collection after 24 hours.

### Connecting with other users

This is one of the areas where there is much work still to be done. As of now their is a capability to for users to add other users to their friends list, but this is currently of no benefit to the user. To make this integration have more purpose I plan on adding.

- #### Friend View: Only shows sightings from yourself and friends
- #### Friend Feed: A feed that displays a chronological list of bird sightings between you and your friends (I also plan on adding a global feed)
- #### Friend Page: I plan to give users the capability to click on a friends profile and check out their sightings and friends.
  
### Styling(Vanilla CSS)

A big part of this project was learning how to visualize the app from the user persective. The process of adding a bird sighting to the map has to be as intuitive as possible while still having the clean look that I wanted. I did all the styling using vanilla css which is something I have used a lot in the past two years. While this app will definitely be intended for mobile use eventually, I wanted to design in fully on desktop just to get a clear idea of how I wanted the sighting process to occur.

## Security

### NextAUTH

### API Route protection (middleware)


TBD
(Link to privacy policy)


## Acknowledgments

In developing Cheep I incorporated BirdNET, a tool designed for avian species recognition through acoustic analysis, available on GitHub. BirdNET, created by Stefan Kahl, Connor M. Wood, Maximilian Eibl, and Holger Klinck, enhances the app's ability to identify bird species from audio recordings. This integration significantly aids in connecting app users with bird identification. For the use of BirdNET in my project, I acknowledge the original work as follows:

> Kahl, S., Wood, C. M., Eibl, M., & Klinck, H. (2021). BirdNET: A deep learning solution for avian diversity monitoring. Ecological Informatics, 61, 101236. Elsevier.


isMobileReady: no
initial load cost: 2-2.3mb
load cost after map toggle: 2.4mb (tiles not stored in cache per google's policy, increases progressively)


