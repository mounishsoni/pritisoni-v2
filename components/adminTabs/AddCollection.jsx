import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import { ToggleButton } from "primereact/togglebutton";

export default function AddCollection({ user }) {
  const AddCollectionFields = {
    title: "",
    description: "",
    videoId: "",
    collectionId: null,
    isDocument: false,
    documentFolder: "",
    documentName: "",
  };

  const toast = useRef(null);
  const [addCollectionData, setAddCollectionData] = useState(JSON.parse(JSON.stringify(AddCollectionFields)));
  const [categoryData, setCategoryData] = useState([]);

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.title}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.title}</div>
      </div>
    );
  };

  async function getCategoryData() {
    const { data, error } = await supabase.from("category").select("category_id, title");

    if (data) {
      setCategoryData(data);
    }
  }

  useEffect(() => {
    getCategoryData();
  }, []);

  const saveForm = async ({ title, description, videoId, collectionId, isDocument, documentFolder, documentName }, setAddCollectionData, user) => {
    try {
      if (!isDocument) {
        if (title && videoId && collectionId && collectionId.id) {
          const { data: collectionData, error: collectionError } = await supabase.from("collection").select("videoId, collection_id").eq("videoId", videoId).single();

          if (!collectionData) {
            const { data, error } = await supabase.from("collection").insert([
              {
                title: title,
                description: description,
                videoId: videoId,
                collection_id: collectionId.id,
              },
            ]);
            if (error) {
              // open toast
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while inserting a playlist",
              });
            } else {
              // open toast
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Video successfully added to Playlist",
              });
              setAddCollectionData(JSON.parse(JSON.stringify(AddCollectionFields)));
            }
          } else {
            // open toast
            toast.current.show({
              severity: "error",
              summary: "Duplicate Entry",
              detail: "This video is already added in playlist under collection " + playlistData.collection_id,
            });
          }
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please fill all the required fields!",
          });
        }
      } else {
        if (title && documentFolder && documentName) {
          const { data: collectionData, error: collectionError } = await supabase
            .from("collection")
            .select("document_name")
            .eq("document_folder", documentFolder)
            .eq("document_name", documentName)
            .single();

          if (!collectionData) {
            const { data, error } = await supabase.from("collection").insert([
              {
                title: title,
                description: description,
                collection_id: "f9ad0eb5-bc08-4566-8c47-ae6c20510f2e",
                is_document: true,
                document_folder: documentFolder,
                document_name: documentName,
              },
            ]);
            if (error) {
              // open toast
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while inserting a playlist",
              });
            } else {
              // open toast
              toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Document successfully added to Playlist",
              });
              setAddCollectionData(JSON.parse(JSON.stringify(AddCollectionFields)));
            }
          } else {
            // open toast
            toast.current.show({
              severity: "error",
              summary: "Duplicate Entry",
              detail: "This document is already added in playlist",
            });
          }
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please fill all the required fields!",
          });
        }
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error in catch while inserting a playlist",
      });
    }
  };

  return (
    <>
      <Toast ref={toast} appendTo={null} />
      <Tooltip target=".ac-form-tooltip" />
      <div className="grid card">
        <div className="col-12">
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="acIsDoc" className="vertical-align-middle">
                Is this a Document?
              </label>
              <i
                className="pi pi-info-circle ac-form-tooltip mx-2"
                data-pr-tooltip="Required, If you are adding as a document then you must select 'YES'"
                data-pr-position="right"
                style={{ fontSize: "1rem", cursor: "pointer" }}
              />
              <ToggleButton
                checked={addCollectionData.isDocument}
                onChange={(e) => {
                  setAddCollectionData((previousState) => ({
                    ...previousState,
                    isDocument: e.target.value,
                  }));
                  console.log(e.target.value);
                }}
                className="w-auto h-auto vertical-align-middle"
              />
              {/* 
              <SelectButton
                value={addCollectionData.isDocument}
                onChange={(e) => {
                  setAddCollectionData((previousState) => ({
                    ...previousState,
                    isDocument: e.target.value,
                  }));
                }}
                options={["true"]}
              /> */}
            </div>
            <div className="field">
              <label htmlFor="acTitle">Title</label>
              <InputText
                id="acTitle"
                type="text"
                value={addCollectionData.title}
                onChange={(e) => {
                  setAddCollectionData((previousState) => ({
                    ...previousState,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acDesc">Description</label>
              <InputText
                id="acDesc"
                type="text"
                value={addCollectionData.description}
                onChange={(e) => {
                  setAddCollectionData((previousState) => ({
                    ...previousState,
                    description: e.target.value,
                  }));
                }}
              />
            </div>
            {!addCollectionData.isDocument ? (
              <>
                <div className="field">
                  <label htmlFor="acVideoID">Video ID</label>
                  <InputText
                    id="acSubTitle"
                    type="text"
                    value={addCollectionData.videoId}
                    onChange={(e) => {
                      setAddCollectionData((previousState) => ({
                        ...previousState,
                        videoId: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="acCollection">Collection</label>
                  <Dropdown
                    value={addCollectionData.collectionId}
                    onChange={(e) => {
                      setAddCollectionData((previousState) => ({
                        ...previousState,
                        collectionId: e.target.value,
                      }));
                    }}
                    options={categoryData}
                    optionLabel="title"
                    placeholder="Select a collection"
                    filter
                    filterDelay={400}
                    valueTemplate={selectedCountryTemplate}
                    itemTemplate={countryOptionTemplate}
                  />
                  {/* <InputText
                id="apCollection"
                type="text"
                value={addCollectionData.collectionId}
                onChange={(e) => {
                  setAddCollectionData((previousState) => ({
                    ...previousState,
                    collectionId: e.target.value,
                  }));
                }}
              /> */}
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label htmlFor="acDocFolder">Document Folder</label>
                  <i
                    className="pi pi-info-circle ac-form-tooltip mx-2"
                    data-pr-tooltip="Required, If you are adding as a document then you must to enter the PATH/FOLDER, EXACTLY as mentioned in the storage"
                    data-pr-position="right"
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                  />
                  <InputText
                    id="acDocFolder"
                    type="text"
                    value={addCollectionData.documentFolder}
                    onChange={(e) => {
                      setAddCollectionData((previousState) => ({
                        ...previousState,
                        documentFolder: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="acDocName">Document Name</label>
                  <i
                    className="pi pi-info-circle ap-form-tooltip mx-2"
                    data-pr-tooltip="Required, If you are adding as a document then you must to enter the FILE NAME, EXACTLY as mentioned in the storage"
                    data-pr-position="right"
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                  />
                  <InputText
                    id="acDocName"
                    type="text"
                    value={addCollectionData.documentName}
                    onChange={(e) => {
                      setAddCollectionData((previousState) => ({
                        ...previousState,
                        documentName: e.target.value,
                      }));
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-12">
          <Button
            severity="secondary"
            label="Reset Form"
            onClick={(e) => {
              e.preventDefault();
              setAddCollectionData(JSON.parse(JSON.stringify(AddCollectionFields)));
            }}
          ></Button>
          <Button
            className="mx-2"
            label="Save"
            onClick={(e) => {
              e.preventDefault();
              saveForm(addCollectionData, setAddCollectionData, user);
            }}
          ></Button>
        </div>
      </div>
    </>
  );
}
