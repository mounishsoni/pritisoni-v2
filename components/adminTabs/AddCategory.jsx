import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function AddCategory({ user }) {
  return (
    <>
      <div className="grid card">
        <div className="col-12">
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="acTitle">Title</label>
              <InputText id="acTitle" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acDesc">Description</label>
              <InputText id="acDesc" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acSubTitle">Sub Title</label>
              <InputText id="acSubTitle" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acURL">URL</label>
              <InputText id="acURL" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acLabel">Label</label>
              <InputText id="acLabel" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acIcon">Icon</label>
              <InputText id="acIcon" type="text" />
            </div>
            <div className="field">
              <label htmlFor="acRole">Role</label>
              <InputText id="acRole" type="text" />
            </div>
          </div>
        </div>
        <div className="col-12">
          <Button severity="secondary" label="Reset Form"></Button>
          <Button className="mx-2" label="Save"></Button>
        </div>
      </div>
    </>
  );
}
