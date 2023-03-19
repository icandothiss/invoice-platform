import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import invoiceReducer from "../features/invoices/invoiceSlice";
import emailReducer from "../features/emails/emailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoiceReducer,
    emails: emailReducer,
  },
});
