
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Content } from "@/data/defaultContent";
import { DEFAULT_CONTENT } from "@/data/defaultContent";
type State = { content: Content; setContent: (c: Content) => void; reset: () => void; };
export const useAppStore = create<State>()(persist((set) => ({ content: DEFAULT_CONTENT, setContent: (c) => set({ content: c }), reset: () => set({ content: DEFAULT_CONTENT }) }), { name: "portfolio-admin-content" }));
