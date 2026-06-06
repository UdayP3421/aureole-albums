import { create } from "zustand";

type StudioState = {
  selectedAlbumId: string;
  selectedCategory: string;
  setSelectedAlbumId: (albumId: string) => void;
  setSelectedCategory: (category: string) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  selectedAlbumId: "",
  selectedCategory: "Wedding",
  setSelectedAlbumId: (albumId) => set({ selectedAlbumId: albumId }),
  setSelectedCategory: (category) => set({ selectedCategory: category })
}));
