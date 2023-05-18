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
  const SaveState = Object.freeze({
    New: "new",
    Clean: "clean",
    Dirty: "dirty",
  });

  const SearchParams = Object.freeze({
    Templates: "templates",
    SearchString: "search_string",
    SearchOption: "search_option",
    SortOption: "sort_option",
  });

  const EmailFields = Object.freeze({
    Recipients: "Ontvangers",
    Cc: "Cc",
    Bcc: "Bcc",
    Subject: "Onderwerp",
    Body: "Inhoud",
  });

  const [templateList, setTemplateList] = useState([]);
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [sortOption, setSortOptions] = useState("");
  const [templateURL, setTemplateURL] = useState("");
  const [saveState, setSaveState] = useState(SaveState.New);
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
    setSaveState(SaveState.Clean);
  };

  const loadTemplates = async () => {
    const templates = await TemplateService.get();
    setTemplateList(templates);
    return templates;
  };

  const loadPage = async () => {
    const templates = await loadTemplates();
    setSearchResults(templates);
    if (templates.length > 0) {
      await updateTemplateSelection(templates[0].url);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const mailtoURL = () => {
    let url = "mailto:";
    let putQuestionMark = false;

    const addOption = (optionRef, optionName) => {
      const value = optionRef.current.value;
      if (value !== undefined && value !== "") {
        if (putQuestionMark) url += "&";
        else {
          url += "?";
          putQuestionMark = true;
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

  const performSearch = async (options = {}) => {
    let localSearchResults =
      SearchParams.Templates in options
        ? options[SearchParams.Templates]
        : templateList;
    const localSearchString =
      SearchParams.SearchString in options
        ? options[SearchParams.SearchString]
        : searchString;
    const localSearchOptions =
      SearchParams.SearchOption in options
        ? options[SearchParams.SearchOption]
        : searchOptions;
    const filterAllowAll = localSearchOptions.length === 0;
    const localSortOption =
      SearchParams.SortOption in options
        ? options[SearchParams.SortOption]
        : sortOption;

    // Search: Only consider selected fields, unless none are given
    localSearchResults = localSearchResults.filter((template) => {
      const search = localSearchString.current.value.toLowerCase();
      return (
        filterAllowAll ||
        (localSearchOptions.includes(EmailFields.Recipients) &&
          template["to"].toLowerCase().includes(search)) ||
        filterAllowAll ||
        (localSearchOptions.includes(EmailFields.Recipients) &&
          template["cc"].toLowerCase().includes(search)) ||
        filterAllowAll ||
        (localSearchOptions.includes(EmailFields.Recipients) &&
          template["bcc"].toLowerCase().includes(search)) ||
        filterAllowAll ||
        (localSearchOptions.includes(EmailFields.Subject) &&
          template["subject"].toLowerCase().includes(search)) ||
        filterAllowAll ||
        (localSearchOptions.includes(EmailFields.Body) &&
          template["body"].toLowerCase().includes(search))
      );
    });
    if (localSortOption !== "") {
      localSearchResults.sort((a, b) => {
        switch (localSortOption) {
          case EmailFields.Recipients:
            return a["to"] > b["to"];
          case EmailFields.Cc:
            return a["cc"] > b["cc"];
          case EmailFields.Bcc:
            return a["bcc"] > b["bcc"];
          case EmailFields.Subject:
            return a["subject"] > b["subject"];
          case EmailFields.Body:
            return a["body"] > b["body"];
        }
      });
    }
    setSearchResults(localSearchResults);
  };

  const updateSearchCriteria = async (selections) => {
    setSearchOptions(selections);
    const paramObj = {};
    paramObj[SearchParams.SearchOption] = selections;
    performSearch(paramObj);
  };

  const updateSorting = async (selections) => {
    const option = selections.length ? selections[0] : "";
    setSortOptions(option);
    const paramObj = {};
    paramObj[SearchParams.SortOption] = option;
    performSearch(paramObj);
  };

  const saveTemplate = async () => {
    if (saveState === SaveState.Clean) return;

    const data = {
      to: fieldTo.current.value,
      cc: fieldCc.current.value,
      bcc: fieldBcc.current.value,
      subject: fieldSubject.current.value,
      body: fieldBody.current.value,
    };

    let response = null;

    if (saveState === SaveState.Dirty) {
      response = await TemplateService.patchEntryByUrl(templateURL, data);
    } else if (saveState === SaveState.New) {
      response = await TemplateService.postEntry(data);
    }
    const templates = await loadTemplates();
    await updateTemplateSelection(response.url);

    if (saveState === SaveState.New) performSearch(templates);

    setSaveState(SaveState.Clean);
  };

  const newTemplate = async () => {
    setTemplateURL("");
    fieldTo.current.value = "";
    fieldCc.current.value = "";
    fieldBcc.current.value = "";
    fieldSubject.current.value = "";
    fieldBody.current.value = "";

    setSaveState(SaveState.New);
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
        <h1>{data["to"]}</h1>
        <p className={"font-semibold"}>{data["subject"]}</p>
      </div>
    );
  };

  const handleTextChange = () => {
    if (saveState === SaveState.Clean) setSaveState(SaveState.Dirty);
  };

  const SaveButton = () => {
    if (saveState === SaveState.Clean) {
      return null;
    } else {
      const buttonText =
        saveState === SaveState.Dirty
          ? "Wijzigingen opslaan"
          : saveState === SaveState.New
          ? "Nieuw template opslaan"
          : "error";
      return (
        <PrimaryButton icon={faSave} onClick={() => saveTemplate()}>
          {buttonText}
        </PrimaryButton>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Dr. Trottoir: Mail-templates</title>
      </Head>

      <div className={"h-4/5"}>
        <PrimaryCard className={"m-2"}>
          <div className={"flex justify-between"}>
            <div className={"flex"}>
              <Dropdown
                icon={faFilter}
                text={"Filter"}
                className={"mr-2"}
                options={[
                  EmailFields.Recipients,
                  EmailFields.Subject,
                  EmailFields.Body,
                ]}
                onClick={updateSearchCriteria}
              >
                Zoek op
              </Dropdown>
              <Dropdown
                icon={faSort}
                text={"Sort"}
                className={"mr-2"}
                options={Object.values(EmailFields)}
                onClick={updateSorting}
              >
                Sorteer op
              </Dropdown>
              <InputField
                classNameDiv={"w-80"}
                reference={searchString}
                icon={faSearch}
                actionCallback={performSearch}
              />
            </div>
            <PrimaryButton
              icon={faPlusCircle}
              text={"Sort"}
              onClick={newTemplate}
            >
              Nieuw
            </PrimaryButton>
          </div>
        </PrimaryCard>
        <div className={"flex"}>
          <PrimaryCard className={"m-2 basis-3/4"}>
            <p>Ontvangers</p>
            <CustomInputField
              classNameDiv={"my-2"}
              reference={fieldTo}
              onChange={handleTextChange}
            />
            <p>Cc.</p>
            <CustomInputField
              classNameDiv={"my-2"}
              reference={fieldCc}
              onChange={handleTextChange}
            />
            <p>Bcc.</p>
            <CustomInputField
              classNameDiv={"my-2"}
              reference={fieldBcc}
              onChange={handleTextChange}
            />
            <p>Onderwerp</p>
            <CustomInputField
              classNameDiv={"my-2"}
              reference={fieldSubject}
              onChange={handleTextChange}
            />
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
                onChange={handleTextChange}
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
              <SaveButton />
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
