

import { Category } from "@/models/category";
import { atom } from "jotai";

const categoryAtom = atom<Category | null>(null)

export default categoryAtom;