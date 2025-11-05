"use client";

import { Header } from "./header";
import { Toolbar } from "./toolbar";
import { NodesPanel } from "./nodes-panel";
import { observer } from "mobx-react-lite";

export const LeftPanel = observer(() => {
  return (
    <div className="h-full flex flex-col border-r border-bd-50">
      {/* Header */}
      <Header />

      {/* Toolbar */}
      <Toolbar />

      {/* Nodes/Layers Panel */}
      <NodesPanel />
    </div>
  );
});
