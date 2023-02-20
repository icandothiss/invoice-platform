import { Link } from "react-router-dom";

function InvoiceItem({ invoice }) {
  return (
    <tr>
      <td>{invoice.number}</td>
      <td>{invoice.clientName}</td>
      <td>{invoice.clientEmail}</td>
      <td>{new Date(invoice.date).toDateString("en-US")}</td>
      <td>{new Date(invoice.paymentDueDate).toDateString("en-US")}</td>
      <td>{invoice.total}</td>
      <td>
        <div className={`status btn-sm status-${invoice.status}`}>
          {" "}
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
