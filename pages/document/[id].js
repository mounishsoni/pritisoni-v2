import React, { useEffect, useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { supabase } from "../../config/supabaseClient";
import { Chip } from "primereact/chip";
import { useRouter } from "next/router";
import { Tooltip } from "primereact/tooltip";

const Document = () => {
  const [documentListData, setDocumentListData] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const router = useRouter();

  async function fetchDocument() {
    // fetch document data
    try {
      if (categoryId) {
        const { data, error } = await supabase.from("collection").select("*").eq("category_id", categoryId).order("created_dttm", { ascending: false });
        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setDocumentListData(data);
        }
      }
    } catch (e) {
      // todo: add new error toast...
      //   toast.error(
      //     "System is unavailable.  Unable to fetch Client Data.  Please try again later or contact tech support!",
      //     {
      //       position: "bottom-right",
      //       autoClose: false,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "colored",
      //     }
      //   );
    }
  }

  useMemo(() => {
    if (router.query.id !== undefined) {
      setCategoryId(router.query.id);
    }
  }, [router.query]);

  useEffect(() => {
    fetchDocument();
  }, [categoryId]);

  async function viewDocument(document) {
    console.log(document);
    const documentFolder = document.document_folder;
    const documentName = document.document_name;

    const { data, error } = supabase.storage.from("application").getPublicUrl(documentFolder + "/" + documentName);

    if (data && data.publicUrl) {
      console.log(data.publicUrl);
      window.open(data.publicUrl);
    } else {
      console.error("Error while fetching document URL", error);
    }
  }

  return (
    // <div className="card grid mt-1">
    //   <div class="col-12 md:col-6 lg:col-3">
    //     <Card
    //       title="Advanced Card"
    //       subTitle="Card subtitle"
    //       footer={footer}
    //       // header={header}
    //       className="md:w-25rem"
    //     >
    //       <p className="m-0">
    //         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
    //         sed consequuntur error repudiandae numquam deserunt quisquam
    //         repellat libero asperiores earum nam nobis, culpa ratione quam
    //         perferendis esse, cupiditate neque quas!
    //       </p>
    //     </Card>
    //   </div>
    // </div>
    <>
      <div className="grid lg:ml-3">
        {Array.from(documentListData).map((document) => (
          <div className="col-12 lg:col-6 xl:col-4">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span
                    className="block font-medium text-lg mb-3 surface-overlay overflow-hidden text-overflow-ellipsis white-space-nowrap tooltip-show-full-title"
                    data-pr-tooltip={document.title}
                    data-pr-position="right"
                    style={{ width: "200px" }}
                  >
                    {document.title}
                  </span>

                  <Tooltip target=".tooltip-show-full-title" mouseTrack mouseTrackLeft={10} />

                  <div className="font-medium">
                    <Chip className="text-sm" label={document.description} />
                  </div>
                </div>
                <Button
                  className="pi pi-file"
                  tooltip="View/Print"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    viewDocument(document);
                  }}
                  style={{ width: "1rem", height: "2.5rem" }}
                />
              </div>
              {/* <span className="text-green-500 font-medium">24 new </span>
            <span className="text-500">since last visit</span> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Document;
