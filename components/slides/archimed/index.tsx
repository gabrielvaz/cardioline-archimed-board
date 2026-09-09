import type { ComponentType } from "react";
import { A0Cover } from "./A0Cover";
import { A1Ask } from "./A1Ask";
import { A2Structural } from "./A2Structural";
import { A3InstalledBase } from "./A3InstalledBase";
import { A4RecurringUse } from "./A4RecurringUse";
import { A5Buckets } from "./A5Buckets";
import { A6Recurring } from "./A6Recurring";
import { A7WhatItChanges } from "./A7WhatItChanges";
import { A8MustBeTrue } from "./A8MustBeTrue";
import { A9Decision } from "./A9Decision";

/** Slides da versão Archimed, por id do registry em `lib/slides-archimed.ts`. */
export const ARCHIMED_SLIDE_COMPONENTS: Record<string, ComponentType> = {
  cover: A0Cover,
  "the-ask": A1Ask,
  "structural-problem": A2Structural,
  "installed-base": A3InstalledBase,
  "recurring-use": A4RecurringUse,
  "exam-volume": A5Buckets,
  "recurring-model": A6Recurring,
  "what-it-changes": A7WhatItChanges,
  "what-must-be-true": A8MustBeTrue,
  decision: A9Decision,
};
