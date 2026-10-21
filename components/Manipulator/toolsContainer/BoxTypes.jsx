"use client";

import React from "react";
import ToolContainer from "../assets/ToolContainer";
import BoxTypesList from "../tools/BoxTypesList";

export default function BoxTypes() {
  return (
    <ToolContainer heading={"Box Types & Presets"}>
      <BoxTypesList />
    </ToolContainer>
  );
}
