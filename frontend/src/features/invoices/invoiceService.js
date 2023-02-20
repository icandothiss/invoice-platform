import axios from "axios";

const API_URL = "/api/invoicings/";

// Create new invoice
const createInvoice = async (invoiceData, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, invoiceData, config);

  return response.data;
};

// Get user invoices
const getInvoices = async (token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

// Get user invoice
const getInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + invoiceId, config);

  return response.data;
};

// pay invoice
const payInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + invoiceId,
    { status: "paid" } + "/pay",
    config
  );

  return response.data;
};

const invoiceService = {
  createInvoice,
  getInvoices,
  getInvoice,
  payInvoice,
};

export default invoiceService;
