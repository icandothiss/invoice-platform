import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmail, reset } from "../features/emails/emailSlice";

function EmailForm() {
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.emails
  );

  const { user } = useSelector((state) => state.auth);

  const [emailData, setEmailData] = useState({
    receiver: "",
    subject: "",
    body: "",
  });

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      sendEmail({
        receiver: emailData.receiver,
        subject: emailData.subject,
        body: window.location.href + "/pay",
        sender: user.email,
      })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      alert("Email sent successfully!");
      dispatch(reset());
    }
    if (isError) {
      alert(`Error sending email: ${message}`);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Receiver:
          <input
            type="email"
            name="receiver"
            value={emailData.receiver}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Email"}
        </button>
      </form>
    </>
  );
}

export default EmailForm;
