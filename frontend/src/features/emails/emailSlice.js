import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import emailService from "./emailService";

const initialState = {
  emails: [],
  email: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new invoice
export const sendEmail = createAsyncThunk(
  "invoices/create",
  async (emailData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.sendEmail(emailData, token);
    } catch (error) {
      const message =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = emailSlice.actions;
export default emailSlice.reducer;
