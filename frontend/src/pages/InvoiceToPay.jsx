import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getInvoice,
  reset,
  payInvoice,
} from "../features/invoices/invoiceSlice";
import Spinner from "../components/Spinner";
import InvoiceItems from "../components/InvoiceItems";
import React, { useRef } from "react";
import { Navigate } from "react-router-dom";

function Invoice() {
  const form = useRef();
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  const { invoice, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.invoices
  );
  const { user } = useSelector((state) => state.auth);

  const params = useParams();
  const dispatch = useDispatch();
  const { invoiceId } = useParams();

  const handlePayClick = () => {
    if (window.confirm("Are you sure you want to send payment?")) {
      dispatch(payInvoice(invoiceId));
      toast.success("Invoice has been marked as paid.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset);
      if (!user || user.email !== invoice.clientEmail) {
        return <Navigate to="/" />;
      }
    }

    dispatch(getInvoice(invoiceId));
  }, [isError, message, invoiceId]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something went wrong</h3>;
  }

  return (
    <>
      <div className="invoice-UI">
        <div className="header-UI">
          <div className="header-left">
            <h2>Invoice</h2>
          </div>
          <div className="header-right">
            <p>Invoice Number: {invoice.number}</p>
            <p>
              Date:{" "}
              <strong>{new Date(invoice.date).toDateString("en-US")}</strong>
            </p>
          </div>
        </div>
        <div className="invoice-info-UI">
          <div className="info-left">
            <h3>Billed To:</h3>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientEmail}</p>
          </div>
          <div className="info-right">
            <h3>Payment Due:</h3>
            <p>{new Date(invoice.paymentDueDate).toDateString("en-US")}</p>
          </div>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            {invoice.items
              ? invoice.items.map((item) => (
                  <InvoiceItems key={item._id} item={item} />
                ))
              : null}
            <tr>
              <td colSpan="3" className="total">
                Subtotal
              </td>
              <td className="total">{invoice.total}</td>
            </tr>
            <tr>
              <td colSpan="3" className="total">
                Tax
              </td>
              <td className="total">{invoice.taxes}</td>
            </tr>
            <tr>
              <td colSpan="3" className="total">
                Total
              </td>
              <td className="total">
                {isNaN(Number(invoice.total)) || isNaN(Number(invoice.taxes))
                  ? "Error"
                  : Number(invoice.total) - Number(invoice.taxes)}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
      <button onClick={handlePayClick}>pay</button>
    </>
  );
}

export default Invoice;
