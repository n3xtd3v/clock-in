import { createSlice } from "@reduxjs/toolkit";

export type TimestampSlice = {
  timestamps: any;
};

const initialState: TimestampSlice = {
  timestamps: [],
};

export const timestamp = createSlice({
  name: "timestamp",
  initialState,
  reducers: {
    getTimestampsById: (state, action) => {
      state.timestamps = action.payload;
    },
    updateTimestamp: (state, action) => {
      state.timestamps = [...action.payload, ...state.timestamps];
    },
  },
});

export const { getTimestampsById, updateTimestamp } = timestamp.actions;

export default timestamp.reducer;
