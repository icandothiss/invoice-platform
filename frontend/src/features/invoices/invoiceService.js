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

const invoiceService = {
  createInvoice,
};

export default invoiceService;
