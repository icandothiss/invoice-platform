import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createInvoice, reset } from "../features/invoices/invoiceSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function NewInvoice() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.invoices
  );

  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [companyName] = useState(user.name);
  const [companyAddress] = useState(user.email);
  const [companyPhone] = useState(user.phone);
  const [items, setItems] = useState([
    { item: "", description: "", quantity: "", price: "" },
  ]);
  const [taxes, setTaxes] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate("/invoices");
    }

    dispatch(reset());
  }, [dispatch, isError, isSuccess, message, navigate]);

  const handlePaymentDueChange = (event) => {
    setPaymentDueDate(event.target.value);
  };

  const handleBilledNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handleBilledAddressChange = (event) => {
    setClientAddress(event.target.value);
  };

  const handleBilledEmailChange = (event) => {
    setClientEmail(event.target.value);
  };

  const handleTaxesChange = (event) => {
    setTaxes(event.target.value);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { item: "", description: "", quantity: "", price: "" },
    ]);
  };

  const handleInvoiceItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index][event.target.name] = event.target.value;
    setItems(updatedItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      createInvoice({
        clientEmail,
        clientName,
        clientAddress,
        taxes,
        paymentDueDate,
        items,
      })
    );
    console.log(items);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url="/" />
      <section className="heading">
        <h1>Create new invoice</h1>
        <p>Please fill out your informations below!</p>
      </section>

      <form onSubmit={handleSubmit}>
        <h2>Company Information</h2>
        <div className="form-group">
          <label htmlFor="companyName">Name:</label>
          <input
            type="text"
            id="companyName"
            className="form-control"
            value={companyName}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyAddress">Address:</label>
          <input
            type="text"
            id="companyAddress"
            className="form-control"
            value={companyAddress}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyPhone">Phone:</label>
          <input
            type="text"
            id="companyPhone"
            className="form-control"
            value={companyPhone}
            readOnly
          />
        </div>
        <h2>Invoice Information</h2>
        <div className="form-group">
          <label htmlFor="paymentDue">Payment Due:</label>
          <input
            type="date"
            id="paymentDue"
            className="form-control"
            value={paymentDueDate}
            onChange={handlePaymentDueChange}
            required
          />
        </div>
        <h2>Billed To:</h2>
        <div className="form-group">
          <label htmlFor="billedName">Name:</label>
          <input
            type="text"
            id="billedName"
            className="form-control"
            value={clientName}
            onChange={handleBilledNameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="billedEmail">Email:</label>
          <input
            type="email"
            name="email"
            id="ClientEmail"
            className="form-control"
            value={clientEmail}
            onChange={handleBilledEmailChange}
            placeholder="Enteremail"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="billedAddress">Address:</label>
          <input
            type="text"
            id="billedAddress"
            className="form-control"
            value={clientAddress}
            onChange={handleBilledAddressChange}
            required
          />
        </div>
        <h3>Invoice Items:</h3>
        {items.map((item, index) => (
          <div key={index} className="invoice-item">
            <div className="form-group">
              <label htmlFor={`item-${index}`}>Item:</label>
              <input
                type="text"
                id={`item-${index}`}
                className="form-control"
                name="item"
                value={item.item}
                onChange={(event) => handleInvoiceItemChange(index, event)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`description-${index}`}>Description:</label>
              <input
                type="text"
                id={`description-${index}`}
                className="form-control"
                name="description"
                value={item.description}
                onChange={(event) => handleInvoiceItemChange(index, event)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`quantity-${index}`}>Quantity:</label>
              <input
                type="Number"
                id={`quantity-${index}`}
                className="form-control"
                name="quantity"
                value={item.quantity}
                onChange={(event) => handleInvoiceItemChange(index, event)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`price-${index}`}>Price:</label>
              <input
                type="Number"
                id={`price-${index}`}
                className="form-control"
                name="price"
                value={item.price}
                onChange={(event) => handleInvoiceItemChange(index, event)}
                required
              />
            </div>
          </div>
        ))}
        <button
          className="btn btn-primary mb-4"
          type="button"
          onClick={handleAddItem}
        >
          Add Item
        </button>
        <div className="form-group">
          <label htmlFor="taxes">Taxes:</label>
          <input
            type="Number"
            id="taxes"
            className="form-control"
            value={taxes}
            onChange={handleTaxesChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary submit">
          Submit
        </button>
      </form>
    </>
  );
}
export default NewInvoice;
