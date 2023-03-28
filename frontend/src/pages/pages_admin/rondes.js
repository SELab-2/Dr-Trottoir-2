// All of this will be needed later so do not delete!

// import {useEffect, useState} from "@types/react";
// import {TourService} from "@/services/tour.services";
// import {BuildingInTourService} from "@/services/buildingInTour.service";
// import {VisitService} from "@/services/visit.service";
//
// const [response, setResponse] = useState('{}');
// const [tours, setTours] = useState([]);
//
// useEffect(  () => {
//     const allTours = async () => {
//         const response = await TourService.getAll()
//         //setTours(JSON.stringify(response, null, 2))
//         const btResponse = await BuildingInTourService.getAll()
//         const visitResponse = await VisitService.getAll()
//         const tour = []
//
//         if (response.hasOwnProperty("results") && btResponse.hasOwnProperty("results") && visitResponse.hasOwnProperty("results")){
//             const list = response["results"]
//             const visits = visitResponse["results"].map((entry) => entry["building_in_tour"])
//             console.log(visits)
//
//             for(let i in list){
//                 let finished = 0
//                 const entry = list[i]
//                 const url = entry["url"]
//                 const buildings = btResponse["results"].filter((entry) => entry["tour"] === url).map((entry) => entry["url"])
//                 for(let i = 0; i < buildings.length; i++){
//                     for (let j = 0; j < visits.length; j++) {
//                         if ( visits[j] === buildings[i]){
//                             finished++
//                         }
//                     }
//                 }
//                 tour.push({"url": url, "name": entry["name"], "amount": buildings.length, "finished": finished})
//             }
//         }
//         setTours(tour)
//     }
//     allTours().catch()
// },[]);

// import SmallTour from "@/components/SmallTour";
// import SelectionList from "@/components/SelectionList";
//
// <SelectionList
// 						Component={({url, background, setSelected, callback, data}) => (<SmallTour key={url} background={background} setSelected={setSelected} callback={callback} data={data}/>)}
// 						title={"Rondes"}
// 						callback={() => {console.log("callback is called!")}}
// 						elements={tours}
// 					/>
