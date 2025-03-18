export interface Journal {
    id: string;
    title: string;
    content: string;
    category: string;
    date: Date;
    color?: string;
};

import { atom } from "jotai";

const journalAtom = atom<Journal | null>(null)

export default journalAtom;