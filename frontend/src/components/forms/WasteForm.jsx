import SelectForm from "@/components/forms/forms-components/forms-input/SelectForm";
import BasicForm from "@/components/forms/BasicForm";
import Loading from "@/components/Loading";
import TourService from "@/services/tour.service";
import { urlToPK } from "@/utils/urlToPK";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SecondaryCard from "../custom-card/SecondaryCard";
import BuildingService from "@/services/building.service";
import TableWasteSchedule from "./forms-components/forms-input/TableWasteSchedule";
import CustomWeekPicker from "../input-fields/CustomWeekPicker";
import moment from "moment";
import wasteService from "@/services/waste.service";
import InputForm from "./forms-components/forms-input/InputForm";
import Dropdown from "../Dropdown";
import { faBicycle } from "@fortawesome/free-solid-svg-icons";

export default function WasteForm() {
  const [loading, setLoading] = useState(true);
  const [loadSchedule, setLoadSchedule] = useState(false);
  const router = useRouter();

  const [allTours, setAllTours] = useState([]);
  const [tourBuildings, setTourBuildings] = useState([]);
  const [waste, setWaste] = useState([]);
  const [changedWaste, setChangedWaste] = useState({});
  const [week, setWeek] = useState([
    moment().startOf("isoWeek").toDate(),
    moment().endOf("isoWeek").toDate(),
  ]);
  const [weekCopy, setWeekCopy] = useState(0);
  const [submitKey, setSubmitKey] = useState(0);

  const onSubmit = async (event) => {
    setLoadSchedule(true);
    event.preventDefault();

    for (const tourUrl in changedWaste) {
      for (const building in changedWaste[tourUrl]) {
        for (const date in changedWaste[tourUrl][building]) {
          for (const type in changedWaste[tourUrl][building][date]) {
            const [newState, timesChanged] =
              changedWaste[tourUrl][building][date][type];
            let state = newState === 2 ? "Binnen" : "Buiten";

            const matchingEntry = waste.find(
              (entry) =>
                entry.building === building &&
                entry.date === date &&
                entry.waste_type === type
            );

            if (newState === 0) {
              // delete entry
              if (matchingEntry) {
                await wasteService.deleteByUrl(matchingEntry.url);
              }
            } else if (newState === timesChanged) {
              // create entry
              const data = {
                date,
                waste_type: type,
                building,
                action: state,
              };
              await wasteService.post(data);
            } else if (newState !== timesChanged) {
              // update entry
              if (matchingEntry) {
                const data = { action: state };
                await wasteService.patchByUrl(matchingEntry.url, data);
              }
            }
          }
        }
      }
    }

    // copy weeks for following 100 days
    if (weekCopy > 0) {
      // first delete every waste entry in the weeks you want to replace
      let buildingUrls = [];
      // get the url of the buildings in all the selected tours
      for (const tourUrl in tourBuildings) {
        buildingUrls = buildingUrls.concat(
          tourBuildings[tourUrl].buildings.map(
            (building) => building.building.url
          )
        );
      }
      for (let i = 1; weekCopy * i * 7 < 100; i++) {
        const monday = moment(week[0])
          .add(weekCopy * i, "weeks")
          .toDate();
        const sunday = moment(week[1])
          .add(weekCopy * i, "weeks")
          .toDate();
        let wasteEntries = await wasteService.get({
          startDate: monday,
          endDate: sunday,
        });
        wasteEntries = wasteEntries.filter((w) =>
          buildingUrls.includes(w.building)
        );
        await Promise.all(
          wasteEntries.map(async (wasteEntry) => {
            await wasteService.deleteByUrl(wasteEntry.url);
          })
        );
      }

      // add the copies
      const wasteEntries = await wasteService.get({
        startDate: week[0],
        endDate: week[1],
      });
      for (const buildingUrl of buildingUrls) {
        const buildingWaste = wasteEntries.filter((w) =>
          buildingUrl.includes(w.building)
        );
        const promises = buildingWaste.flatMap((wasteEntry) => {
          const newEntries = [];

          for (let i = 1; weekCopy * i * 7 < 100; i++) {
            const newDate = moment(wasteEntry.date)
              .add(1, "days")
              .add(i * weekCopy, "weeks")
              .toDate()
              .toISOString()
              .substring(0, 10);

            const newEntryPromise = wasteService.post({
              date: newDate,
              action: wasteEntry.action,
              building: wasteEntry.building,
              waste_type: wasteEntry.waste_type,
            });

            newEntries.push(newEntryPromise);
          }
          return newEntries;
        });
        await Promise.all(promises);
      }
    }
    await changeWeek(week[0], week[1]);
    setLoadSchedule(false);
  };

  useEffect(() => {
    // Fetch initial data
    async function fetchData() {
      setLoading(true);
      setAllTours(await TourService.get());
      const wasteSchedule = await wasteService.get({
        startDate: week[0],
        endDate: week[1],
      });
      setWaste(wasteSchedule);
    }

    fetchData()
      .then(() => setLoading(false))
      .catch();
  }, []);

  if (loading) {
    return (
      <div className={"flex justify-center items-center h-fit w-full"}>
        <Loading className={"w-10 h-10"} />
      </div>
    );
  }

  // Function to change the selected week
  const changeWeek = async (dateFrom, dateTo) => {
    setWeek([dateFrom, dateTo]);
    setLoadSchedule(true);
    // Fetch the waste schedule for the selected week
    const wasteSchedule = await wasteService.get({
      startDate: dateFrom,
      endDate: dateTo,
    });
    setWaste(wasteSchedule);
    if (Object.keys(tourBuildings).length !== 0) {
      setTourBuildings((prevTourBuildings) => {
        const updatedTourBuildings = { ...prevTourBuildings };

        for (const tourUrl in updatedTourBuildings) {
          updatedTourBuildings[tourUrl].waste = updatedTourBuildings[
            tourUrl
          ].buildings.reduce((dict, building) => {
            const filteredWaste = wasteSchedule.filter(
              (w) => w.building === building.building.url
            );
            dict[building.building.url] = filteredWaste;
            return dict;
          }, {});
        }

        return updatedTourBuildings;
      });
    }
    setSubmitKey((prevKey) => prevKey + 1);
    setLoadSchedule(false);
  };

  const changeTours = async (tours) => {
    setLoadSchedule(true);
    const updatedTourBuildings = {};

    for (const tour of tours) {
      const tourUrl = tour[1].url;
      if (tourUrl in tourBuildings) {
        updatedTourBuildings[tourUrl] = tourBuildings[tourUrl];
      } else {
        const buildingsInTour = await TourService.getBuildingsFromTour(
          urlToPK(tourUrl)
        );
        const fixedFormat = await Promise.all(
          buildingsInTour.map(async (buildingInTour) => ({
            building: await BuildingService.getEntryByUrl(
              buildingInTour.building
            ),
            order_index: buildingInTour.order_index,
          }))
        );
        // sort building according to index
        const sorted = fixedFormat.sort(
          (a, b) => a.order_index - b.order_index
        );
        // get waste data of buildings
        const buildingsWaste = sorted.reduce((dict, building) => {
          const filteredWaste = waste.filter(
            (w) => w.building === building.building.url
          );
          dict[building.building.url] = filteredWaste;
          return dict;
        }, {});
        updatedTourBuildings[tourUrl] = {
          buildings: sorted,
          waste: buildingsWaste,
          name: tour[0],
        };
      }
    }
    setTourBuildings(updatedTourBuildings);
    setLoadSchedule(false);
  };

  const updateWaste = (changes, tourUrl) => {
    setChangedWaste((prevState) => ({
      ...prevState,
      [tourUrl]: changes,
    }));
  };

  return (
    <BasicForm loading={loading} onSubmit={onSubmit} model={"planning"}>
      <div className="flex space-x-2 mb-4">
        <div className="space-y-2 flex-1">
          <label className={"font-bold"}>Week</label>
          <CustomWeekPicker
            startDate={week[0]}
            endDate={week[1]}
            className={"w-full"}
            onChange={changeWeek}
          />
        </div>
        <div className="space-y-2 flex-1">
          <label className={"font-bold"}>Rondes</label>
          <Dropdown
            multi={true}
            icon={faBicycle}
            options={allTours.map((tour) => tour.name)}
            optionsValues={allTours}
            onClick={changeTours}
            buttonClassName={"border-light-h-2 bg-light-bg-2"}
          >
            <p>Rondes</p>
          </Dropdown>
        </div>
      </div>
      {loadSchedule ? (
        <div className={"flex justify-center items-center h-fit w-full"}>
          <Loading className={"w-10 h-10"} />
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(tourBuildings).map(([tourUrl, tour]) => (
            <SecondaryCard key={tourUrl}>
              <label className={"font-bold mb-2"}> {tour.name} </label>
              <TableWasteSchedule
                buildings={tour.buildings}
                wasteSchedule={tour.waste}
                startDate={week[0]}
                onChange={(w) => updateWaste(w, tourUrl)}
                key={submitKey}
              ></TableWasteSchedule>
            </SecondaryCard>
          ))}
          {Object.keys(tourBuildings).length !== 0 && (
            <div className="flex space-x-2 items-center">
              <p>Voeg deze weekkalenders toe om de </p>
              <InputForm
                id={"repetition"}
                type={"number"}
                value={weekCopy}
                className={"w-16 !space-y-0"}
                onChange={(e) => setWeekCopy(e.target.value)}
              />
              <p> weken.</p>
            </div>
          )}
        </div>
      )}
    </BasicForm>
  );
}
