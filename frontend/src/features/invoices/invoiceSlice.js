import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import invoiceService from "./invoiceService";

const initialState = {
  invoices: [],
  invoice: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new invoice
export const createInvoice = createAsyncThunk(
  "invoices/create",
  async (invoiceData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await invoiceService.createInvoice(invoiceData, token);
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

// Get user invoices
export const getInvoices = createAsyncThunk(
  "invoices/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await invoiceService.getInvoices(token);
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

// Get user invoice
export const getInvoice = createAsyncThunk(
  "invoices/get",
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await invoiceService.getInvoice(ticketId, token);
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

// Pay invoice
export const payInvoice = createAsyncThunk(
  "invoices/pay",
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await invoiceService.payInvoice(ticketId, token);
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

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoices = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
