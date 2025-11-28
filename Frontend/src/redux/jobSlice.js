import { createSlice } from "@reduxjs/toolkit";
const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    allEmployerJobs: [],
    searchJobByText: "",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setAllEmployerJobs: (state, action) => {
      state.allEmployerJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
  },
});

export const { setAllJobs, setAllEmployerJobs, setSearchJobByText } = jobSlice.actions;
export default jobSlice.reducer;
