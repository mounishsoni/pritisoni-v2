import React, { useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";

export default function ModernKanban() {
  // 1. Task State with richer data (progress, description, members)
  const [tasks, setTasks] = useState([
    { id: "1", title: "UX Research", desc: "User interviews for new feature", status: "todo", priority: "High", progress: 0 },
    { id: "2", title: "API Integration", desc: "Connect to Stripe endpoints", status: "in-process", priority: "Medium", progress: 60 },
    { id: "3", title: "Unit Testing", desc: "Ensure coverage > 80%", status: "completed", priority: "Low", progress: 100 },
    { id: "4", title: "Dashboard UI", desc: "Fix dark mode contrast", status: "in-process", priority: "High", progress: 45 },
  ]);

  // --- Drag & Drop Handlers ---
  const onDragStart = (e, id) => e.dataTransfer.setData("id", id);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData("id");
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, status: targetStatus };
      return task;
    });
    setTasks(updatedTasks);
  };

  const getSeverity = (priority) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "info";
    }
  };

  // --- Column Renderer ---
  const renderColumn = (title, status, dotColor) => {
    const columnTasks = tasks.filter((t) => t.status === status);

    return (
      <div className="col-12 md:col-4 p-3 h-full">
        {/* Modern Header: Minimalist and Clean */}
        <div className="flex align-items-center justify-content-between mb-4 px-2">
          <div className="flex align-items-center gap-2">
            {/* Dot Indicator */}
            <span className={`w-1rem h-1rem border-circle ${dotColor}`}></span>
            <h2 className="text-xl font-semibold text-900 m-0">{title}</h2>
            <span className="text-500 font-medium text-lg ml-2">({columnTasks.length})</span>
          </div>
          <Button icon="pi pi-plus" rounded text severity="secondary" aria-label="Add" />
        </div>

        {/* Drop Zone with subtle background */}
        <div
          className="p-3 h-full border-round-2xl transition-all transition-duration-300"
          style={{ backgroundColor: "#f8f9fa", minHeight: "70vh" }}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, status)}
        >
          {columnTasks.map((task) => (
            <div key={task.id} draggable onDragStart={(e) => onDragStart(e, task.id)} className="cursor-move mb-4 hover:transform-translate-y--2 transition-all transition-duration-300">
              <Card className="border-none shadow-1 hover:shadow-6 border-round-xl surface-card p-0">
                {/* Card Header: Priority Tag & Menu */}
                <div className="flex justify-content-between align-items-start mb-3">
                  <Tag value={task.priority} severity={getSeverity(task.priority)} className="px-2 py-1 text-xs border-round-lg" style={{ letterSpacing: "0.5px" }} />
                  <i className="pi pi-ellipsis-h text-400 cursor-pointer hover:text-700"></i>
                </div>

                {/* Card Body: Title & Desc */}
                <h4 className="text-900 font-bold mb-2 text-lg mt-0">{task.title}</h4>
                <p className="text-500 text-sm mt-0 mb-4 line-height-3">{task.desc}</p>

                {/* Card Footer: Progress Bar & Avatars */}
                <div className="flex align-items-center justify-content-between pt-3 border-top-1 border-100">
                  <div className="flex flex-column w-6 mr-3">
                    <div className="flex justify-content-between mb-1">
                      <span className="text-xs text-500">Progress</span>
                      <span className="text-xs font-bold text-700">{task.progress}%</span>
                    </div>
                    <ProgressBar value={task.progress} showValue={false} style={{ height: "6px" }} color={task.progress === 100 ? "#22c55e" : "#6366f1"} />
                  </div>

                  <AvatarGroup className="mb-0">
                    <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="normal" shape="circle" />
                    <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png" size="normal" shape="circle" />
                  </AvatarGroup>
                </div>
              </Card>
            </div>
          ))}

          {/* Empty State Placeholder */}
          {columnTasks.length === 0 && (
            <div className="flex flex-column align-items-center justify-content-center h-10rem border-2 border-dashed border-300 border-round-xl m-2 opacity-60">
              <span className="text-400 font-medium text-sm">Drop items here</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="surface-ground min-h-screen p-5">
      {/* Top Bar / Page Header */}
      <div className="flex justify-content-between align-items-center mb-5 px-3">
        <div>
          <h1 className="text-3xl font-bold text-900 m-0 mb-1">Product Roadmap</h1>
          <span className="text-500">Sprint 42 • Aug 24 - Sep 01</span>
        </div>
        <div className="flex gap-2">
          <Button label="Filter" icon="pi pi-filter" text severity="secondary" />
          <Button label="New Task" icon="pi pi-plus" className="bg-indigo-600 border-indigo-600" />
        </div>
      </div>

      {/* The Kanban Grid */}
      <div className="grid">
        {renderColumn("To Do", "todo", "bg-indigo-500")}
        {renderColumn("In Progress", "in-process", "bg-orange-400")}
        {renderColumn("Done", "completed", "bg-green-400")}
      </div>
    </div>
  );
}
