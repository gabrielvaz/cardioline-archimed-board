import type { ComponentType } from "react";
import { G0Cover } from "./G0Cover";
import { G1Ask } from "./G1Ask";
import { G2Structural } from "./G2Structural";
import { G3InstalledBase } from "./G3InstalledBase";
import { G4RecurringUse } from "./G4RecurringUse";
import { G5Buckets } from "./G5Buckets";
import { G6Recurring } from "./G6Recurring";
import { G7WhatItChanges } from "./G7WhatItChanges";
import { G8MustBeTrue } from "./G8MustBeTrue";
import { G9Decision } from "./G9Decision";

/** Slides da versão de grupo, por id do registry em `lib/slides-archimed-group.ts`. */
export const ARCHIMED_GROUP_SLIDE_COMPONENTS: Record<string, ComponentType> = {
  cover: G0Cover,
  "the-ask": G1Ask,
  "structural-problem": G2Structural,
  "installed-base": G3InstalledBase,
  "recurring-use": G4RecurringUse,
  "exam-volume": G5Buckets,
  "recurring-model": G6Recurring,
  "what-it-changes": G7WhatItChanges,
  "what-must-be-true": G8MustBeTrue,
  decision: G9Decision,
};
