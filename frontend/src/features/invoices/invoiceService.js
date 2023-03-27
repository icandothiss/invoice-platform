import axios from "axios";

const API_URL = "https://invoice-platform.onrender.com/api/invoicings/";

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

// Update Invoice
const updateInvoice = async (invoiceId, invoice, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + invoiceId, invoice, config);

  return response.data;
};

// Pay invoice
const payInvoice = async (invoiceId) => {
  const response = await axios.put(API_URL + invoiceId + "/pay");

  return response.data;
};

// Delete invoice
const deleteInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + invoiceId, config);

  return response.data;
};

const invoiceService = {
  createInvoice,
  getInvoices,
  getInvoice,
  payInvoice,
  updateInvoice,
  deleteInvoice,
};

export default invoiceService;
