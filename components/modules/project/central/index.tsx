"use client";

import { Canvas } from "./canvas";
import { observer } from "mobx-react-lite";

export const CentralArea = observer(() => {
  return (
    <div className="w-full h-full relative">
      <Canvas />
    </div>
  );
});
