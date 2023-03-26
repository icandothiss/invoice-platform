import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getInvoices, reset } from "../features/invoices/invoiceSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import InvoiceItem from "../components/InvoiceItem";

function Invoices() {
  const { invoices, isLoading, isSuccess, message, isError } = useSelector(
    (state) => state.invoices
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [dispatch, isSuccess, isError, message]);

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url="/" />
      <div className="container mt-5 ">
        <h2 className="text-center mb-5">Invoice Dashboard</h2>
        <table className="table table-striped">
          <thead>
            <tr className="table-row">
              <th>Invoice Number</th>
              <th>Cl Name</th>
              <th>Date</th>
              <th>Due</th>
              <th>Total</th>
              <th>Update</th>
              <th>Delete</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody id="invoices">
            {invoices.data && invoices.data.length > 0
              ? invoices.data.map((invoice) => (
                  <InvoiceItem key={invoice._id} invoice={invoice} />
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Invoices;
