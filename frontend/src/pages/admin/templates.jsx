import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import InputField from "@/components/input-fields/InputField";
import SelectionList from "@/components/selection/SelectionList";
import TemplateService from "@/services/template.service";
import {
  faEnvelope,
  faFilter,
  faPlusCircle,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Templates() {
  const [templateList, setTemplateList] = useState([]);
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [templateURL, setTemplateURL] = useState("");
  const [templateDetail, setTemplateDetail] = useState({});

  const updateTemplateSelection = async (url) => {
    setTemplateURL(url);
    const template = await TemplateService.getEntryByUrl(url);
    setTemplateDetail(template);
  };

  const loadTemplates = async () => {
    const templates = await TemplateService.get();
    setTemplateList(templates);
    setSearchResults(templates);
    await updateTemplateSelection(templates[0].url);
  };

  const mailtoURL = (template) => {
    let url = "mailto:";
    let putQM = false;

    const addOption = (option) => {
      if (template[option] !== undefined && template[option] !== "") {
        if (putQM) url += "&";
        else {
          url += "?";
          putQM = true;
        }
        url += option + "=" + encodeURIComponent(template[option]);
      }
    };

    if (template["to"] !== undefined) url += template["to"];
    addOption("cc");
    addOption("bcc");
    addOption("subject");
    addOption("body");
    return url;
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const performSearch = () => {
    setSearchResults(
      templateList.filter((template) => {
        const search = searchString.current.value.toLowerCase();
        return (
          template["to"].toLowerCase().includes(search) ||
          template["cc"].toLowerCase().includes(search) ||
          template["bcc"].toLowerCase().includes(search) ||
          template["subject"].toLowerCase().includes(search) ||
          template["body"].toLowerCase().includes(search)
        );
      })
    );
  };

  const TemplateSelectionItem = ({
    data,
    callback,
    setSelected,
    background,
  }) => {
    const url = data["url"];

    function handleClick() {
      setSelected(url);
      callback(url);
    }

    return (
      <div
        className={"p-2 rounded-lg space-y-1 cursor-pointer"}
        style={{ backgroundColor: background }}
        onClick={handleClick}
      >
        <h1 className={"font-semibold"}>{data["to"]}</h1>
        <p>{data["subject"]}</p>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Templates</title>
      </Head>

      <div className={"h-4/5"}>
        <PrimaryCard className={"m-2"}>
          <div className={"flex justify-between"}>
            <div className={"flex"}>
              <Dropdown
                icon={faFilter}
                text={"Filter"}
                className={"mr-2"}
                options={[]}
              >
                Filter
              </Dropdown>
              <Dropdown
                icon={faSort}
                text={"Sort"}
                className={"mr-2"}
                options={[]}
              >
                Sort
              </Dropdown>
              <InputField
                classNameDiv={"w-80"}
                reference={searchString}
                icon={faSearch}
                actionCallback={() => performSearch()}
              />
            </div>
            <PrimaryButton icon={faPlusCircle} text={"Sort"}>
              Nieuw
            </PrimaryButton>
          </div>
        </PrimaryCard>
        <div className={"flex"}>
          <PrimaryCard className={"m-2 basis-3/4"}>
            <SecondaryButton
              icon={faEnvelope}
              onClick={(event) => {
                window.location.href = mailtoURL(templateDetail);
                event.preventDefault();
              }}
            >
              Stuur e-mail
            </SecondaryButton>
          </PrimaryCard>
          <SelectionList
            title={"Templates"}
            className={"m-2 basis-1/4 max-h-4/5"}
            elements={searchResults}
            callback={(url) => {
              updateTemplateSelection(url);
            }}
            Component={({ url, background, setSelected, callback, data }) => (
              <TemplateSelectionItem
                key={url}
                background={background}
                setSelected={setSelected}
                callback={callback}
                data={data}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}

Templates.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
