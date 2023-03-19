import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteInvoice, getInvoices } from "../features/invoices/invoiceSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

function InvoiceItem({ invoice }) {
  const { invoices, isLoading, isSuccess, message, isError } = useSelector(
    (state) => state.invoices
  );

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteInvoice(invoice._id));
    toast.success("Invoice deleted successfully.");
    dispatch(getInvoices());
  };

  return (
    <tr>
      <td>{invoice.number}</td>
      <td>{invoice.client.name}</td>
      <td>{new Date(invoice.date).toDateString("en-US")}</td>
      <td>{new Date(invoice.paymentDueDate).toDateString("en-US")}</td>
      <td>{invoice.total}</td>
      <td>
        <Link
          to={`/invoice/update/${invoice._id}`}
          className="btn btn-reverse btn-sm"
        >
          Update
        </Link>
      </td>
      <td>
        <div className="btn btn-reverse btn-sm" onClick={handleDelete}>
          Delete
        </div>
      </td>
      <td>
        <div className={`status btn-sm status-${invoice.status}`}>
          {invoice.status}
        </div>
      </td>
      <td>
        <Link to={`/invoice/${invoice._id}`} className="btn btn-reverse btn-sm">
          View
        </Link>
      </td>
    </tr>
  );
}

export default InvoiceItem;
