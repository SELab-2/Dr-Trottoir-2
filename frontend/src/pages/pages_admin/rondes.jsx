/*
// NOTE(Elias): DO NOT DELETE! This was testing code and will be reused later in the development of this page.

import {useEffect, useState} from "@types/react";
import {TourService} from "@/services/tour.services";
import {BuildingInTourService} from "@/services/buildingInTour.service";
import {VisitService} from "@/services/visit.service";

const [response, setResponse] = useState('{}');
const [tours, setTours] = useState([]);

useEffect(  () => {
    const allTours = async () => {
        const response = await TourService.getAll()
        //setTours(JSON.stringify(response, null, 2))
        const btResponse = await BuildingInTourService.getAll()
        const visitResponse = await VisitService.getAll()
        const tour = []

        if (response.hasOwnProperty("results") && btResponse.hasOwnProperty("results") && visitResponse.hasOwnProperty("results")){
            const list = response["results"]
            const visits = visitResponse["results"].map((entry) => entry["building_in_tour"])
            console.log(visits)

            for(let i in list){
                let finished = 0
                const entry = list[i]
                const url = entry["url"]
                const buildings = btResponse["results"].filter((entry) => entry["tour"] === url).map((entry) => entry["url"])
                for(let i = 0; i < buildings.length; i++){
                    for (let j = 0; j < visits.length; j++) {
                        if ( visits[j] === buildings[i]){
                            finished++
                        }
                    }
                }
                tour.push({"url": url, "name": entry["name"], "amount": buildings.length, "finished": finished})
            }
        }
        setTours(tour)
    }
    allTours().catch()
},[]);

import CustomProgressBar from "@/components/ProgressBar";

export default function SmallTour({ data, callback, setSelected, background }) {
    const url = data["url"];
    let name = "";
    let amount = 1;
    let finished = 0;
    if (data !== undefined) {
        console.log(data["name"]);
        console.log(data);
        name = data["name"];
        if (data["amount"] > 0) {
            amount = data["amount"];
        }
        finished = data["finished"];
    }

    function handleClick() {
        setSelected(url);
        callback();
    }

    return (
        <div
            data-testid="small-tour"
            className={"p-4 rounded-lg space-y-3 cursor-pointer"}
            style={{ backgroundColor: background }}
            onClick={handleClick}
        >
            <h1 className={"font-semibold"}>{name}</h1>
            <CustomProgressBar finishedCount={finished} amount={amount} />
        </div>
    );
}

import SmallTour from "@/components/SmallTour";
import SelectionList from "@/components/SelectionList";

<SelectionList
						Component={({url, background, setSelected, callback, data}) => (<SmallTour key={url} background={background} setSelected={setSelected} callback={callback} data={data}/>)}
						title={"Rondes"}
						callback={() => {console.log("callback is called!")}}
						elements={tours}
					/>
*/
