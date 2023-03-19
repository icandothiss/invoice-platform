import axios from "axios";

const API_URL = "/api/emails/";

// Create new invoice
const sendEmail = async (emailData, token) => {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, emailData, config);

  return response.data;
};

const emailService = {
  sendEmail,
};

export default emailService;
