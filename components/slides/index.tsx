import type { ComponentType } from "react";
import { S01Opening } from "./S01Opening";
import { S02Legacy } from "./S02Legacy";
import { S03WhatChanges } from "./S03WhatChanges";
import { S04Transformation } from "./S04Transformation";
import { S05Ambition } from "./S05Ambition";
import { S06ProductQuality } from "./S06ProductQuality";
import { S07InTheirHands } from "./S07InTheirHands";
import { S08InTheirMinds } from "./S08InTheirMinds";

/** Slides implementados, por id do registry. Os que faltam caem no stub. */
export const SLIDE_COMPONENTS: Record<string, ComponentType> = {
  opening: S01Opening,
  legacy: S02Legacy,
  "what-changes": S03WhatChanges,
  transformation: S04Transformation,
  ambition: S05Ambition,
  "product-quality": S06ProductQuality,
  "in-their-hands": S07InTheirHands,
  "in-their-minds": S08InTheirMinds,
};
