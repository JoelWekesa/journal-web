

import { Journal } from "@/models/journal";
import { atom } from "jotai";

const journalAtom = atom<Journal | null>(null)

export default journalAtom;