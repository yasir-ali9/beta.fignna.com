"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { Layout } from "./layout";
import { Geometry } from "./geometry";
import { Material } from "./material";
import { Environment } from "./environment";
import { Background } from "./background";
import { Export } from "./export";
import { observer } from "mobx-react-lite";

export const RightPanel = observer(() => {
  return (
    <div className="h-full flex flex-col border-l border-bd-50">
      {/* Header */}
      <Header />

      {/* Sections - No tabs, just stacked sections */}
      <div className="flex-1 overflow-auto">
        <Layout />
        <Geometry />
        <Material />
        <Environment />
        <Background />
        <Export />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
});
