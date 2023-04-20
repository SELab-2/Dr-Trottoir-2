import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import CustomInputField from "@/components/input-fields/InputField";
import InputField from "@/components/input-fields/InputField";
import SelectionList from "@/components/selection/SelectionList";
import TemplateService from "@/services/template.service";
import {
  faEnvelope,
  faFilter,
  faPlusCircle,
  faSave,
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
  const [saveState, setSaveState] = useState("clean"); // states: "clean", "dirty", "new"
  const fieldTo = useRef("");
  const fieldCc = useRef("");
  const fieldBcc = useRef("");
  const fieldSubject = useRef("");
  const fieldBody = useRef("");

  const updateTemplateSelection = async (url) => {
    setTemplateURL(url);
    const template = await TemplateService.getEntryByUrl(url);
    fieldTo.current.value = template["to"] !== undefined ? template["to"] : "";
    fieldCc.current.value = template["cc"] !== undefined ? template["cc"] : "";
    fieldBcc.current.value =
      template["bcc"] !== undefined ? template["bcc"] : "";
    fieldSubject.current.value =
      template["subject"] !== undefined ? template["subject"] : "";
    fieldBody.current.value =
      template["body"] !== undefined ? template["body"] : "";
  };

  const loadTemplates = async () => {
    const templates = await TemplateService.get();
    setTemplateList(templates);
    setSearchResults(templates);
    await updateTemplateSelection(templates[0].url);
  };

  const mailtoURL = () => {
    let url = "mailto:";
    let putQM = false;

    const addOption = (optionRef, optionName) => {
      const value = optionRef.current.value;
      if (value !== undefined && value !== "") {
        if (putQM) url += "&";
        else {
          url += "?";
          putQM = true;
        }
        url += optionName + "=" + encodeURIComponent(value);
      }
    };

    if (fieldTo.current.value !== undefined) url += fieldTo.current.value;
    addOption(fieldCc, "cc");
    addOption(fieldBcc, "bcc");
    addOption(fieldSubject, "subject");
    addOption(fieldBody, "body");
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

  const saveTemplate = async () => {
    const data = {};
    data["to"] = fieldTo.current.value;
    data["cc"] = fieldCc.current.value;
    data["bcc"] = fieldBcc.current.value;
    data["subject"] = fieldSubject.current.value;
    data["body"] = fieldBody.current.value;

    if (saveState === "dirty") {
      await TemplateService.postEntryByUrl(templateURL, data);
    } else if (saveState === "new") {
      await TemplateService.putEntry(data);
    }
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
            <p>Ontvangers</p>
            <CustomInputField classNameDiv={"my-2"} reference={fieldTo} />
            <p>Cc.</p>
            <CustomInputField classNameDiv={"my-2"} reference={fieldCc} />
            <p>Bcc.</p>
            <CustomInputField classNameDiv={"my-2"} reference={fieldBcc} />
            <p>Onderwerp</p>
            <CustomInputField classNameDiv={"my-2"} reference={fieldSubject} />
            <p>E-mail</p>
            <div
              className={
                "rounded-lg bg-light-bg-2 p-1 border-2 border-light-border relative flex items-center my-2"
              }
            >
              <textarea
                rows={12}
                name={"input-field"}
                ref={fieldBody}
                type="text"
                className={"flex-1 bg-light-bg-2 outline-none"}
                onChange={() => {
                  setSaveState("dirty");
                }}
              />
            </div>
            <div className={"flex"}>
              <SecondaryButton
                icon={faEnvelope}
                onClick={() => {
                  window.open(mailtoURL(), "_blank", "noreferrer");
                }}
              >
                Stuur e-mail
              </SecondaryButton>
              <SecondaryButton
                backgroundColor={"#ffffff"}
                icon={faSave}
                onClick={() => saveTemplate()}
              >
                Bewaren
              </SecondaryButton>
            </div>
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
