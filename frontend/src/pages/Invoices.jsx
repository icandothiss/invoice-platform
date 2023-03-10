import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getInvoices, reset } from "../features/invoices/invoiceSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import InvoiceItem from "../components/InvoiceItem";

function Invoices() {
  const { invoices, isLoading, isSuccess } = useSelector(
    (state) => state.invoices
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset());
      }
    };
  }, [dispatch, isSuccess]);

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
              <th>Cl Email</th>
              <th>Date</th>
              <th>Due</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
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
