import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Knob } from "primereact/knob";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { VibrateIcon, VibrateOffIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";

export default function MantraWatch() {
  const user = useSelector((state) => state.initialState.user);

  const toast = useRef(null);

  // --- State ---
  const [mantras, setMantras] = useState(0);
  const [malas, setMalas] = useState(0);

  // Temporary states for the input fields before "Set" is clicked
  const [tempMantra, setTempMantra] = useState(108);
  const [tempMala, setTempMala] = useState(1);

  const [showSuccess, setShowSuccess] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const [mantraTarget, setMantraTarget] = useState(108);
  const [malaTarget, setMalaTarget] = useState(1);

  const isGoalAchieved = malas >= malaTarget;

  // --- Logic ---
  useEffect(() => {
    if (mantras >= mantraTarget && !isGoalAchieved) {
      setMalas((prev) => prev + 1);
      setMantras(0);
    }
  }, [mantras, mantraTarget, isGoalAchieved]);

  async function updateCounterGoalStatus() {
    try {
      const { data, error } = await supabase
        .from("users_mantra")
        .upsert(
          {
            updated_dttm: new Date(),
            goal_achieved: true,
            user_id: user.id,
          },
          { onConflict: "user_id" }, // Use a comma-separated string for multiple column check
        )
        .select();

      if (data) {
        setShowSuccess(data[0].goal_achieved);
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while updating Goal Achievement`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while updating Goal Achievement, Please try again later or contact tech support",
      });
    }
  }

  useEffect(() => {
    if (isGoalAchieved) {
      updateCounterGoalStatus();
    }
  }, [isGoalAchieved]);

  async function fetchAndSetCurrentData() {
    try {
      const { data, error } = await supabase.from("users_mantra").select("*").eq("user_id", user.id);

      if (data) {
        setMantraTarget(data[0].mantra_target);
        setMalaTarget(data[0].mala_target);

        setMantras(data[0].current_japa);
        setMalas(data[0].total_mala);

        setShowSuccess(data[0].goal_achieved);
        setHapticEnabled(data[0].haptics);
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while fetching data`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while fetching data, Please try again later or contact tech support",
      });
    }
  }

  useEffect(() => {
    if (user && user.id !== "") {
      fetchAndSetCurrentData();
    }
  }, [user]);

  // --- Handlers ---
  const handleSetMantra = async () => {
    setMantraTarget(tempMantra);
    toast.current.show({ severity: "success", summary: "Updated", detail: `Mantra target set to ${tempMantra}`, life: 1500 });
  };

  const handleSetMala = async () => {
    setMalaTarget(tempMala);
    toast.current.show({ severity: "success", summary: "Updated", detail: `Mala target set to ${tempMala}`, life: 1500 });
  };

  // --- Reset Handlers ---
  const resetMantrasOnly = async () => {
    try {
      const { data, error } = await supabase
        .from("users_mantra")
        .upsert(
          {
            updated_dttm: new Date(),
            current_japa: 0,
            user_id: user.id,
          },
          { onConflict: "user_id" }, // Use a comma-separated string for multiple column check
        )
        .select();

      if (data) {
        setMantras(data[0].current_japa);
        toast.current.show({ severity: "success", summary: "Updated", detail: `Current Japa resetted to ${data[0].current_japa}`, life: 1500 });
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while resetting Current Japa`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while resetting Current Japa, Please try again later or contact tech support",
      });
    }
  };

  const resetMalasOnly = async () => {
    try {
      const { data, error } = await supabase
        .from("users_mantra")
        .upsert(
          {
            updated_dttm: new Date(),
            total_mala: 0,
            user_id: user.id,
            goal_achieved: false,
          },
          { onConflict: "user_id" }, // Use a comma-separated string for multiple column check
        )
        .select();

      if (data) {
        setMalas(data[0].total_mala);
        setShowSuccess(data[0].goal_achieved);
        toast.current.show({ severity: "success", summary: "Updated", detail: `Total Mala resetted to ${data[0].total_mala}`, life: 1500 });
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while resetting Total Mala`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while resetting Total Mala, Please try again later or contact tech support",
      });
    }
  };

  const resetAll = async () => {
    try {
      const { data, error } = await supabase
        .from("users_mantra")
        .upsert(
          {
            updated_dttm: new Date(),
            total_mala: 0,
            current_japa: 0,
            user_id: user.id,
            goal_achieved: false,
          },
          { onConflict: "user_id" }, // Use a comma-separated string for multiple column check
        )
        .select();

      if (data) {
        setMalas(data[0].total_mala);
        setMantras(data[0].current_japa);
        setShowSuccess(data[0].goal_achieved);
        toast.current.show({ severity: "success", summary: "Updated", detail: `EVERYTHING resetted`, life: 1500 });
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while resetting EVERYTHING`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while resetting EVERYTHING, Please try again later or contact tech support",
      });
    }
  };

  const confirmReset = (message, acceptCallback) => {
    confirmDialog({
      message,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: acceptCallback,
    });
  };

  // --- Haptic Logic ---
  const toggleHaptic = async () => {
    try {
      const { data, error } = await supabase
        .from("users_mantra")
        .upsert(
          {
            updated_dttm: new Date(),
            haptics: !hapticEnabled,
            user_id: user.id,
          },
          { onConflict: "user_id" }, // Use a comma-separated string for multiple column check
        )
        .select();

      if (data) {
        setHapticEnabled(data[0].haptics);

        toast.current.show({
          severity: "info",
          summary: data[0].haptics ? "Haptics On" : "Haptics Off",
          detail: data[0].haptics ? "Vibration enabled" : "Vibration disabled",
          life: 2000,
        });

        if (data[0].haptics && window.navigator.vibrate) {
          window.navigator.vibrate(500);
        }
      } else {
        // open toast
        toast.current.show({ severity: "error", summary: "Error", detail: `Error while updating vibrate mode`, life: 1500 });
      }
    } catch (err) {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error while updating Vibrate Mode, Please try again later or contact tech support",
      });
    }
  };

  const triggerHaptic = () => {
    if (hapticEnabled && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  };

  // Track if we are currently syncing
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Supabase Sync Logic (Debounced) ---
  useEffect(() => {
    // Don't sync if values are 0 (initial load)
    if (mantras === 0 && malas === 0) return;

    // Wait 1.5 seconds after the last state change before saving
    const handler = setTimeout(async () => {
      setIsSyncing(true);

      const { error } = await supabase.from("users_mantra").upsert(
        {
          total_mala: malas,
          current_japa: mantras,
          mantra_target: mantraTarget,
          mala_target: malaTarget,
          user_id: user.id,
          updated_dttm: new Date(),
        },
        { onConflict: "user_id" },
      );
      if (error) {
        console.error("Sync Error:", error.message);
      } else {
        // Optional: show a subtle sync indicator
        console.log("Progress saved to cloud");
      }
      setIsSyncing(false);
    }, 1500);

    return () => clearTimeout(handler);
  }, [mantras, malas, mantraTarget, malaTarget]);

  return (
    <div className="flex flex-column align-items-center justify-content-center text-gray-100 p-3" style={{ minHeight: "calc(100vh - 9rem)" }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Top Utility Bar with Sync Indicator */}
      <div className="flex justify-content-between w-full max-w-26rem mb-4 align-items-center">
        <div className="text-gray-500">
          {isSyncing ? <i className="pi pi-spin pi-spinner mr-2" /> : <i className="pi pi-cloud mr-2" />}
          <span className="text-xs uppercase font-bold">{isSyncing ? "Syncing..." : "Cloud Saved"}</span>
        </div>

        <Button className={`p-button-rounded ${hapticEnabled ? "p-button-warning" : "p-button-secondary p-button-outlined"}`} onClick={toggleHaptic}>
          {hapticEnabled ? <VibrateIcon size={20} /> : <VibrateOffIcon size={20} />}
        </Button>
      </div>

      {/* Watch Frame */}
      <div
        className="relative flex align-items-center justify-content-center border-circle shadow-8 bg-gray-800 border-4 border-gray-700 p-4"
        style={{ width: "300px", height: "300px", boxShadow: "0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.4)" }}
      >
        <div className="absolute">
          <Knob value={mantras} max={mantraTarget} size={300} strokeWidth={1} valueColor="#f59e0b" rangeColor="#374151" showValue={false} readOnly />
        </div>

        <div className="flex flex-column align-items-center z-1">
          <span className="text-orange-400 font-bold text-xl tracking-widest uppercase mb-1">Total Mala</span>
          <div className="surface-900 border-circle flex align-items-center justify-content-center border-1 border-gray-600 mb-3 px-2 py-1">
            <span className="text-4xl font-bold text-white">{malas}</span>
            <span className="text-3xl text-gray-500 ml-1">/{malaTarget}</span>
          </div>
          <span className="text-400 text-xl font-medium uppercase">Current Japa</span>
          <h1 className="text-4xl font-mono m-0 text-white line-height-1">{mantras}</h1>
          <div className="mt-3">
            <span className={`p-tag px-3 py-1 border-round-pill ${isGoalAchieved ? "p-tag-success" : "bg-orange-500"}`}>{isGoalAchieved ? "COMPLETED" : "ACTIVE"}</span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-column align-items-center gap-4 mt-5 w-full max-w-26rem">
        <div className="flex align-items-center justify-content-center gap-4 w-full">
          <Button
            icon="pi pi-minus"
            className="p-button-rounded p-button-outlined p-button-secondary shadow-4"
            onClick={() => {
              setMantras((prev) => Math.max(0, prev - 1));
              triggerHaptic();
            }}
            disabled={isGoalAchieved || mantras === 0}
            style={{ width: "60px", height: "60px", borderWidth: "2px" }}
          />

          <Button
            className={`border-circle shadow-6 flex flex-column align-items-center justify-content-center transition-all transition-duration-200 ${
              isGoalAchieved ? "bg-gray-700 border-gray-600" : "bg-orange-500 border-orange-400 hover:bg-orange-600 active:scale-95"
            }`}
            onClick={() => {
              setMantras((prev) => prev + 1);
              triggerHaptic();
            }}
            disabled={isGoalAchieved}
            style={{
              width: "120px",
              height: "120px",
              border: "6px solid",
              boxShadow: isGoalAchieved ? "none" : "0 10px 20px rgba(245, 158, 11, 0.3)",
            }}
          >
            <i className={`pi ${isGoalAchieved ? "pi-lock" : "pi-plus"} text-4xl text-white`}></i>
          </Button>

          <Button
            icon="pi pi-history"
            className="p-button-rounded p-button-danger p-button-text shadow-2 bg-gray-900"
            style={{ width: "60px", height: "60px" }}
            onClick={() => confirmReset("Are you sure you want to reset EVERYTHING?", resetAll)}
          />
        </div>

        {/* Target Settings */}
        <div className="flex gap-2 justify-content-between w-full border-top-1 border-gray-700 pt-4">
          <div className="flex flex-column align-items-center gap-2">
            <label className="text-l text-700 font-bold uppercase">Mantra Target</label>
            <div className="p-inputgroup flex-1">
              <InputNumber
                // placeholder="Vote"
                value={mantraTarget}
                onValueChange={(e) => setTempMantra(e.value || 1)}
                inputClassName="bg-gray-800 text-white border-gray-700 text-center w-6rem p-2 text-xl"
                disabled={isGoalAchieved}
              />
              <Button icon="pi pi-check" className="p-button-warning" onClick={handleSetMantra} disabled={isGoalAchieved} />
            </div>
            <Button icon="pi pi-refresh" label="Reset Japa" className="p-button-sm p-button-text p-button-secondary" onClick={() => confirmReset("Reset current Japa?", resetMantrasOnly)} />
          </div>

          <div className="flex flex-column align-items-center gap-2">
            <label className="text-l text-700 font-bold uppercase">Mala Target</label>
            <div className="p-inputgroup flex-1">
              <InputNumber
                // placeholder="Vote"
                value={malaTarget}
                onValueChange={(e) => setTempMala(e.value || 1)}
                inputClassName="bg-gray-800 text-white border-gray-700 text-center w-6rem p-2 text-xl"
                disabled={isGoalAchieved}
              />
              <Button icon="pi pi-check" className="p-button-warning" onClick={handleSetMala} disabled={isGoalAchieved} />
            </div>
            <Button icon="pi pi-refresh" label="Reset Mala" className="p-button-sm p-button-text p-button-secondary" onClick={() => confirmReset("Reset Mala count?", resetMalasOnly)} />
          </div>
        </div>
      </div>

      <Dialog header="Mantra Sadhana Achieved" visible={showSuccess} style={{ width: "350px" }} onHide={() => setShowSuccess(false)} className="dark-dialog">
        <div className="text-center">
          <i className="pi pi-sun text-6xl text-orange-500 mb-4"></i>
          <p className="text-lg">Your mantra target is achieved.</p>
          <Button label="Start New Counter" className="p-button-orange mt-3" onClick={resetAll} />
        </div>
      </Dialog>
    </div>
  );
}
