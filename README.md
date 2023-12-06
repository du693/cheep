# Cheep

With Cheep, you can document your sightings and view a detailed map filled with contributions from users all over New England. Ideal for both casual bird enthusiasts and serious birdwatchers, our app offers a clear and concise platform for tracking and sharing avian sightings. Dive in and enrich our collective understanding of local bird populations. Join today and contribute to a comprehensive bird spotting network.


## Overview

Cheep is a dynamic web application developed to showcase my current level of skill in web development. I really liked the idea of making an app that gives people another reason to go outside, similar to pokemonGo, so I decided on bird watching.

In this README, I provide an overview of Cheep's current capabilities and insights into its development. The project serves as a testament to my proficiency in web development and my current level of knowledge on web development, and ability create engaging and interactive applications.


## Capabilities

### Custom MarkerClusterer onClick Event

Customing the Marker Cluster provided in the google maps was essential for a couple reasons. The original cluster click does not solve a very fundamental problem with google maps markers: what if two markers are placed in the same location ? The given Clusterclick event will attempt to zoom into view so all the markers can be spotted, but this will not work in this case. I found some solutions to this online like [this](https://github.com/jawj/OverlappingMarkerSpiderfier). which I also did not like. I instead created my own solution that creates a google maps InfoBox onClick and lists the necessary information from the clustered markers. 

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

This is definitely something I was excited to work on. Bird identification can be a challenging task, so streamlining this process would be extremely important to get inexperienced birdwatchers using the app. [BirdNET](https://github.com/kahst/BirdNET-Analyzer) is an acoustic analysis tool for bird identification. Fortunately, I received some help from my friend Dan (you can check out his profile [here](https://github.com/dannybalentine)), who introduced me to this analyzer. He is currently hosting an AWS EC2 instance that accepts audio files from Cheep users and returns the result from BirdNET, along with a ChatGPT message providing a brief species summary.

Including the ChatGPT response in this API was originally intended to reduce the number of requests made in the application. However, it forcefully provides the user with the GPT response if they use BirdNET, and it will not provide them with a response if they do not. So, I plan to create a separate API route to ensure that requests are made only if the user prompts it to.
### MongoDB/Mongoose utilization
### Global Map View
### Connecting with other users
### Styling(Vanilla CSS)




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


