import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuMinimized: false,
  selectedMenuIndex: 0,

}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.menuMinimized = !state.menuMinimized;
    },
    moveMenuSelection: (state, action) => {
      state.selectedMenuIndex = action.payload;
    },
    setSelectedMenuIndex: (state, action) => {
      state.selectedMenuIndex = action.payload;
    }
  },
});

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export const { toggleMenu, moveMenuSelection, setSelectedMenuIndex } = uiSlice.actions;

