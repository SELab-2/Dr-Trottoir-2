import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import CustomModal from "@/components/Modals/CustomModal";
import RemoveModal from "@/components/Modals/RemoveModal";
import CustomButton from "@/components/button/Button";
import PrimaryButton from "@/components/button/PrimaryButton";
import SecondaryButton from "@/components/button/SecondaryButton";
import PrimaryCard from "@/components/custom-card/PrimaryCard";
import CustomInputField from "@/components/input-fields/InputField";
import InputField from "@/components/input-fields/InputField";
import SelectionList from "@/components/selection/SelectionList";
import TemplateService from "@/services/template.service";
import {
  faCancel,
  faEnvelope,
  faFilter,
  faPen,
  faPlusCircle,
  faSave,
  faSearch,
  faSort,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const LeaveOrigins = Object.freeze({
    None: "none",
    Route: "route",
    OtherTemplate: "other-template",
    New: "new",
  });

  const [templateList, setTemplateList] = useState([]);
  const searchString = useRef("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [sortOption, setSortOptions] = useState("");
  const [templateURL, setTemplateURL] = useState("");
  const [saveState, setSaveState] = useState(SaveState.New);
  const [attemptDelete, setAttemptDelete] = useState(false);
  const [protectLeave, setProtectLeave] = useState(false);
  const [attemptLeaveModalOpen, setAttemptLeaveModalOpen] = useState(false);
  const [attemptedRoute, setAttemptedRoute] = useState();
  const [protectLeaveOrigin, setProtectLeaveOrigin] = useState({
    cause: LeaveOrigins.None,
    param: null,
  });
  const fieldTo = useRef("");
  const fieldCc = useRef("");
  const fieldBcc = useRef("");
  const fieldSubject = useRef("");
  const fieldBody = useRef("");

  const router = useRouter();

  /********* Swapping templates **************/

  const updateTemplateSelection = async (url) => {
    if (!url) {
      loadPage();
      return;
    }
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

  const newTemplate = async () => {
    setTemplateURL("");
    fieldTo.current.value = "";
    fieldCc.current.value = "";
    fieldBcc.current.value = "";
    fieldSubject.current.value = "";
    fieldBody.current.value = "";

    setSaveState(SaveState.New);
  };

  useEffect(() => {
    loadPage();
  }, []);

  /********* Searching/filtering **************/

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

  const reloadSelection = async (selectedURL) => {
    const templates = await loadTemplates();
    await updateTemplateSelection(selectedURL ? selectedURL : null);
    performSearch({ templates: templates });
  };

  /********* Email button **************/

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

  /********* Requests **************/

  const requestData = () => {
    return {
      to: fieldTo.current.value,
      cc: fieldCc.current.value,
      bcc: fieldBcc.current.value,
      subject: fieldSubject.current.value,
      body: fieldBody.current.value,
    };
  };

  const saveNewTemplate = async () => {
    const response = await TemplateService.postEntry(requestData());
    await reloadSelection(response.url);
    setSaveState(SaveState.Clean);
    setProtectLeave(false);
  };
  const updateTemplate = async () => {
    const response = await TemplateService.patchEntryByUrl(
      templateURL,
      requestData()
    );
    await reloadSelection(response.url);
    setSaveState(SaveState.Clean);
    setProtectLeave(false);
  };
  const deleteTemplate = async () => {
    setAttemptDelete(false);
    await TemplateService.deleteEntryByUrl(templateURL);
    await reloadSelection();
    setSaveState(SaveState.Clean);
    setProtectLeave(false);
  };

  /********* Powering modal that asks to confirm when you leave **************/

  const onRouteChangeStart = useCallback(
    (route) => {
      if (!protectLeave) return;

      protectLeaveOrigin.cause = LeaveOrigins.Route;

      setAttemptLeaveModalOpen(true);
      setAttemptedRoute(route);
      throw "cancelRouteChange";
    },
    [protectLeave]
  );

  useEffect(() => {
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => router.events.off("routeChangeStart", onRouteChangeStart);
  }, [onRouteChangeStart]);

  const saveNewTemplateModal = async () => {
    await TemplateService.postEntry(requestData());
    setSaveState(SaveState.Clean);
  };

  const updateTemplateModal = async () => {
    await TemplateService.patchEntryByUrl(templateURL, requestData());
    setSaveState(SaveState.Clean);
  };

  const leaveModalOnCancel = () => {
    setAttemptLeaveModalOpen(false);

    if (protectLeaveOrigin.cause === LeaveOrigins.Route)
      setAttemptedRoute(null);

    protectLeaveOrigin.cause = LeaveOrigins.None;
  };

  const leaveModalOnSave = async () => {
    setAttemptLeaveModalOpen(false);

    if (protectLeaveOrigin.cause === LeaveOrigins.Route) {
      console.log("here now");
      if (saveState === SaveState.New) {
        await saveNewTemplateModal();
      } else if (saveState === SaveState.Dirty) {
        await updateTemplateModal();
      }
      console.log("here");
      router.events.off("routeChangeStart", onRouteChangeStart);
      console.log("pushing");
      router.push(attemptedRoute);
    } else {
      if (saveState === SaveState.New) {
        await saveNewTemplate();
      } else if (saveState === SaveState.Dirty) {
        await updateTemplate();
      }

      if (protectLeaveOrigin.cause === LeaveOrigins.New) newTemplate();
      else if (protectLeaveOrigin.cause === LeaveOrigins.OtherTemplate)
        updateTemplateSelection(protectLeaveOrigin.param);
    }
    setProtectLeave(false);
  };

  const leaveModalOnLeave = () => {
    setAttemptLeaveModalOpen(false);

    if (protectLeaveOrigin.cause === LeaveOrigins.Route) {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.push(attemptedRoute);
    } else if (protectLeaveOrigin.cause === LeaveOrigins.New) newTemplate();
    else if (protectLeaveOrigin.cause === LeaveOrigins.OtherTemplate)
      updateTemplateSelection(protectLeaveOrigin.param);
    setProtectLeave(false);
  };

  /********* Element to put in selectionlist **************/

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

  /********* Powering UI **************/

  const handleTextChange = () => {
    if (saveState === SaveState.Clean) setSaveState(SaveState.Dirty);
    setProtectLeave(true);
  };

  const DataButtons = () => {
    return (
      <div className={"flex flex-row justify-between w-full ml-2"}>
        {/* Modal to confirm deletion */}
        <RemoveModal
          open={attemptDelete}
          element={"template"}
          onCancel={() => setAttemptDelete(false)}
          onDelete={deleteTemplate}
        ></RemoveModal>
        {/* Modal to protect unsaved data */}
        <CustomModal isOpen={attemptLeaveModalOpen} className="z-20">
          <h2 className="text-lg font-bold mb-4">
            Wilt u uw wijzigingen opslaan?
          </h2>
          <div className="flex justify-center">
            <PrimaryButton
              className="mr-2"
              icon={faCancel}
              onClick={leaveModalOnCancel}
            >
              Annuleer
            </PrimaryButton>

            <CustomButton
              className="mr-2 text-dark-h-1 bg-good-1 hover:bg-good-2 active:bg-good-2 active:text-good-1"
              icon={faSave}
              onClick={leaveModalOnSave}
            >
              Bewaar
            </CustomButton>
            <CustomButton
              className="mr-2 text-dark-h-1 bg-bad-1 hover:bg-bad-2 active:bg-bad-2 active:text-bad-1"
              icon={faTrash}
              onClick={leaveModalOnLeave}
            >
              Bewaar niet
            </CustomButton>
          </div>
        </CustomModal>
        {saveState === SaveState.Dirty ? (
          <PrimaryButton
            icon={faPen}
            onClick={updateTemplate}
            className={"flex"}
          >
            Update
          </PrimaryButton>
        ) : null}
        <div className={"flex grow"} />
        {saveState === SaveState.Dirty || saveState === SaveState.New ? (
          <CustomButton
            icon={faSave}
            onClick={saveNewTemplate}
            className={
              "flex text-dark-h-1 bg-good-1 hover:bg-good-2 active:bg-good-2 active:text-good-1"
            }
          >
            Bewaar nieuw
          </CustomButton>
        ) : null}
        {saveState === SaveState.Dirty || saveState === SaveState.Clean ? (
          <CustomButton
            icon={faTrash}
            onClick={() => setAttemptDelete(true)}
            className={
              "flex text-dark-h-1 bg-bad-1 hover:bg-bad-2 active:bg-bad-2 active:text-bad-1"
            }
          >
            Verwijder
          </CustomButton>
        ) : null}
      </div>
    );
  };

  /********* Page **************/

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
              onClick={() => {
                if (!protectLeave) newTemplate();
                else {
                  protectLeaveOrigin.cause = LeaveOrigins.New;
                  setAttemptLeaveModalOpen(true);
                }
              }}
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
                className={"shrink-0"}
              >
                Stuur e-mail
              </SecondaryButton>
              <DataButtons />
            </div>
          </PrimaryCard>
          <SelectionList
            title={"Templates"}
            className={"m-2 basis-1/4 max-h-4/5"}
            elements={searchResults}
            selectedStart={templateURL}
            callback={(url) => {
              if (!protectLeave) updateTemplateSelection(url);
              else {
                protectLeaveOrigin.cause = LeaveOrigins.OtherTemplate;
                protectLeaveOrigin.param = url;
                setAttemptLeaveModalOpen(true);
              }
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
