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
  async (invoiceID, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await invoiceService.getInvoice(invoiceID, token);
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

// Update invoice
export const updateInvoice = createAsyncThunk(
  "invoices/put",
  async (invoice, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const updatedInvoice = await invoiceService.updateInvoice(
        invoice.id,
        invoice,
        token
      );
      return updatedInvoice;
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
  async (invoiceId, thunkAPI) => {
    try {
      return await invoiceService.payInvoice(invoiceId);
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

// Delete invoice
export const deleteInvoice = createAsyncThunk(
  "invoices/delete",
  async (invoiceId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await invoiceService.deleteInvoice(invoiceId, token);
      thunkAPI
        .getState()
        .invoices.data.filter((invoice) => invoice.id !== invoiceId);
      console.log(thunkAPI.getState().invoices.data);
      return invoiceId;
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
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
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
        state.invoices = action.payload;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.invoice = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(payInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(payInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(payInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
