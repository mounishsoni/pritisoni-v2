import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Knob } from "primereact/knob";

export default function MantraWatch() {
  // --- State ---
  const [mantras, setMantras] = useState(0);
  const [malas, setMalas] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [mantraTarget, setMantraTarget] = useState(108);
  const [malaTarget, setMalaTarget] = useState(1);

  const isGoalAchieved = malas >= malaTarget;

  // --- Logic ---
  useEffect(() => {
    // Auto-increment Mala when Mantra target is hit
    if (mantras >= mantraTarget && !isGoalAchieved) {
      setMalas((prev) => prev + 1);
      setMantras(0);
    }
  }, [mantras, mantraTarget, isGoalAchieved]);

  useEffect(() => {
    if (isGoalAchieved) setShowSuccess(true);
  }, [isGoalAchieved]);

  // --- Reset Handlers ---
  const resetMantrasOnly = () => setMantras(0);

  const resetMalasOnly = () => {
    setMalas(0);
    setShowSuccess(false);
  };

  const resetAll = () => {
    setMantras(0);
    setMalas(0);
    setShowSuccess(false);
  };

  // Helper for haptic feedback (20ms is a short, sharp tap)
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center text-gray-100 p-3" style={{ minHeight: "calc(100vh - 9rem)" }}>
      {/* Watch Frame */}
      <div
        className="relative flex align-items-center justify-content-center border-circle shadow-8 bg-gray-800 border-4 border-gray-700 p-4"
        style={{ width: "300px", height: "300px", boxShadow: "0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.4)" }}
      >
        {/* Outer Progress Ring (Knob) */}
        <div className="absolute">
          <Knob value={mantras} max={mantraTarget} size={300} strokeWidth={1} valueColor="#f59e0b" rangeColor="#374151" showValue={false} readOnly />
        </div>

        {/* Inner Watch Face */}
        <div className="flex flex-column align-items-center z-1">
          <span className="text-orange-400 font-bold text-xl tracking-widest uppercase mb-1">Total Mala</span>

          <div className="surface-900 border-circle flex align-items-center justify-content-center border-1 border-gray-600 mb-3 px-2 py-1">
            <span className="text-4xl font-bold text-white">{malas}</span>
            <span className="text-3xl text-gray-500 ml-1">/{malaTarget}</span>
          </div>

          <span className="text-400 text-xl font-medium uppercase">Current Japa</span>
          <h1 className="text-4xl font-mono m-0 text-white line-height-1">{mantras}</h1>

          <div className="mt-3">
            {isGoalAchieved ? (
              <span className="p-tag p-tag-success px-3 py-1 border-round-pill">COMPLETED</span>
            ) : (
              <span className="p-tag p-tag-warning px-3 py-1 border-round-pill bg-orange-500">ACTIVE</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Controls (Increment / Decrement) */}
      <div className="flex flex-column align-items-center gap-4 mt-5 w-full max-w-26rem">
        <div className="flex align-items-center justify-content-center gap-4 w-full">
          {/* Decrement Button */}
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

          {/* Main Increment Button */}
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

          {/* Master Reset Button (Placed for symmetry) */}
          <Button
            icon="pi pi-history"
            className="p-button-rounded p-button-danger p-button-text shadow-2 bg-gray-900"
            style={{ width: "60px", height: "60px" }}
            onClick={resetAll}
            tooltip="Reset All"
          />
        </div>

        {/* Target Settings and Individual Resets */}
        <div className="flex gap-2 justify-content-between w-full border-top-1 border-gray-700 pt-4">
          {/* Mantra Settings */}
          <div className="flex flex-column align-items-center gap-2">
            <label className="text-l text-700 font-bold uppercase">Mantra Goal</label>
            <InputNumber
              value={mantraTarget}
              onValueChange={(e) => setMantraTarget(e.value || 1)}
              inputClassName="bg-gray-800 text-white border-gray-700 text-center w-8rem p-2 text-xl"
              disabled={isGoalAchieved}
            />
            <Button icon="pi pi-refresh" label="Reset Japa" className="p-button-sm p-button-text p-button-secondary text-l" onClick={resetMantrasOnly} />
          </div>

          {/* Mala Settings */}
          <div className="flex flex-column align-items-center gap-2">
            <label className="text-l text-700 font-bold uppercase">Mala Goal</label>
            <InputNumber
              value={malaTarget}
              onValueChange={(e) => setMalaTarget(e.value || 1)}
              inputClassName="bg-gray-800 text-white border-gray-700 text-center w-8rem p-2 text-xl"
              disabled={isGoalAchieved}
            />
            <Button icon="pi pi-refresh" label="Reset Mala" className="p-button-sm p-button-text p-button-secondary text-l" onClick={resetMalasOnly} />
          </div>
        </div>
      </div>

      {/* Completion Dialog */}
      <Dialog header="Sadhana Complete" visible={showSuccess} style={{ width: "350px" }} onHide={() => setShowSuccess(false)} className="p-fluid dark-dialog">
        <div className="text-center">
          <i className="pi pi-sun text-6xl text-orange-500 mb-4"></i>
          <p className="line-height-3 text-lg">
            Your meditation session of <b>{malaTarget} Malas</b> is complete. May you remain in peace.
          </p>
          <Button label="New Session" className="p-button-orange mt-3" onClick={resetAll} />
        </div>
      </Dialog>
    </div>
  );
}
