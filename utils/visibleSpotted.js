// import { useContext, useState } from "react";
// import { SpottedContext } from "@/context/Context";

// //the states and function should be created in the map component and sent back to them

// export default function VisibleMarkers({ bounds, visibleSpotted, addToVisibleArray, removeFromVisibleArray }) {
// 	const { spotted } = useContext(SpottedContext);

//     for spot in spotted(){
//     if (spot.lat is < north and > south && if spot.lng is > west and < west){
//         addToVisibleArray(spot)
//     }

//     for i in visible spotted(){
//         if (i.lat > north || i.lat < south || i.lng < west || i.lng > west){
//             removeFromVisibleArray(i)
//         }
//     }

// }

// }

//call this in a useEffect with the bounds as a dependency, maybe make the bounds round up on N and W and down on S and E
//                                                          so the dependency only causes a refresh on a full round? to what decimal should i round
