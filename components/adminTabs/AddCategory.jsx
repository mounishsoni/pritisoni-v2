import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { supabase } from "../../config/supabaseClient";

export default function AddCategory({ user }) {
  const AddCategoryFields = {
    title: "",
    description: "",
    subTitle: "",
    url: "",
    label: "",
    icon: "",
    role: "",
  };

  const toast = useRef(null);
  const [addCategoryData, setAddCategoryData] = useState(JSON.parse(JSON.stringify(AddCategoryFields)));

  const saveForm = async ({ title, description, subTitle, url, label, icon, role }, setAddCategoryData, user) => {
    try {
      if (title && label) {
        const { data: categoryData, error: collectionError } = await supabase.from("category").select("title, label, category_id").eq("title", title).eq("label", label).single();

        if (!categoryData) {
          const { data, error } = await supabase.from("category").insert([
            {
              title: title,
              description: description ? description : null,
              sub_title: subTitle ? subTitle : null,
              url: url ? url : null,
              label: label,
              icon: icon ? icon : "pi pi-angle-right",
              role: role ? role : "ADMIN",
            },
          ]);
          if (error) {
            // open toast
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Error while inserting a category",
            });
          } else {
            // open toast
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Category added successfully",
            });
            setAddCategoryData(JSON.parse(JSON.stringify(AddCategoryFields)));
          }
        } else {
          // open toast
          toast.current.show({
            severity: "error",
            summary: "Duplicate Entry",
            detail: "This category is already exist " + categoryData.category_id,
          });
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please fill all the required fields!",
        });
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

      <div className="grid card">
        <div className="col-12">
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="acTitle">Title</label>
              <InputText
                id="acTitle"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
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
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    description: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acSubTitle">Sub Title</label>
              <InputText
                id="acSubTitle"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    subTitle: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acURL">URL</label>
              <InputText
                id="acURL"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    url: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acLabel">Label</label>
              <InputText
                id="acLabel"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    label: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acIcon">Icon</label>
              <InputText
                id="acIcon"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    icon: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="acRole">Role</label>
              <InputText
                id="acRole"
                type="text"
                onChange={(e) => {
                  setAddCategoryData((previousState) => ({
                    ...previousState,
                    role: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <Button severity="secondary" label="Reset Form"></Button>
          <Button
            className="mx-2"
            label="Save"
            onClick={(e) => {
              e.preventDefault();
              saveForm(addCategoryData, setAddCategoryData, user);
            }}
          ></Button>
        </div>
      </div>
    </>
  );
}
