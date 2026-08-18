import type { ComponentType } from "react";
import { S01Opening } from "./S01Opening";
import { S02Legacy } from "./S02Legacy";
import { S03WhatChanges } from "./S03WhatChanges";
import { S04Transformation } from "./S04Transformation";
import { S05Ambition } from "./S05Ambition";
import { S06ProductQuality } from "./S06ProductQuality";
import { S07InTheirHands } from "./S07InTheirHands";
import { S08InTheirMinds } from "./S08InTheirMinds";
import { S09DigitalLayer } from "./S09DigitalLayer";
import { S10Anchor } from "./S10Anchor";
import { S11Free } from "./S11Free";
import { S12BusinessModel } from "./S12BusinessModel";
import { S13ThreeLayers } from "./S13ThreeLayers";
import { S14Reveal } from "./S14Reveal";
import { S15Intelligence } from "./S15Intelligence";
import { S16Depth } from "./S16Depth";
import { S17Prediction } from "./S17Prediction";
import { S18Speed } from "./S18Speed";
import { S19Invisible } from "./S19Invisible";
import { S20Standard } from "./S20Standard";
import { S21MustBeTrue } from "./S21MustBeTrue";
import { S22Closing } from "./S22Closing";

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
  "digital-layer": S09DigitalLayer,
  anchor: S10Anchor,
  "free-changes-everything": S11Free,
  "business-model": S12BusinessModel,
  "three-layers": S13ThreeLayers,
  "prototype-reveal": S14Reveal,
  intelligence: S15Intelligence,
  depth: S16Depth,
  prediction: S17Prediction,
  speed: S18Speed,
  "invisible-complexity": S19Invisible,
  "the-standard": S20Standard,
  "what-must-be-true": S21MustBeTrue,
  closing: S22Closing,
};
