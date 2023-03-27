import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getInvoice,
  reset,
  updateInvoice,
} from "../features/invoices/invoiceSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

function UpdateInvoice() {
  const { invoice, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.invoices
  );
  const { user } = useSelector((state) => state.auth);
  const { invoiceId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getInvoice(invoiceId));
  }, [dispatch, invoiceId]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, message, invoiceId, dispatch, isSuccess, navigate]);

  const [formData, setFormData] = useState({
    paymentDueDate:
      "Mon Feb 20 2023 01:00:00 GMT+0100 (Central European Standard Time)",
    taxes: 45,
    adress: "tunisia",
    clientEmail: "oussama@google.fr",
    items: [{ item: "", quantity: "", price: "" }],
  });

  const [items, setItems] = useState(formData.items);

  const handleAddItem = () => {
    setItems([...items, { item: "", quantity: "", price: "" }]);
  };

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "number" ? Number(value) : String(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleItemsChange = (event, index) => {
    const { name, value, type } = event.target;
    console.log(name, value, type);
    const newValue = type === "number" ? Number(value) : String(value);

    setItems((prevItems) => {
      return prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, [name]: newValue };
        } else {
          return item;
        }
      });
    });
  };

  useEffect(() => {
    if (invoice && invoice.items) {
      setFormData(invoice);
      setItems(invoice.items);
    }
  }, [invoice]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateInvoice({ id: invoiceId, ...formData, items }));
    navigate("/invoices");
    toast.success("invoice updated!");
  };

  function handleDeleteItem(index) {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  }

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
        {/* Company Information */}
        <h2>Company Information</h2>
        <div className="form-group">
          <label htmlFor="companyName">Name:</label>
          <input
            type="text"
            id="companyName"
            className="form-control"
            value={user.name}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyAddress">Address:</label>
          <input
            type="text"
            id="companyAddress"
            className="form-control"
            value={user.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="companyPhone">Phone:</label>
          <input
            type="text"
            id="companyPhone"
            className="form-control"
            value={user.phone}
            readOnly
          />
        </div>

        {/* Invoice Information */}
        <h2>Invoice Information</h2>
        <div className="form-group">
          <label htmlFor="paymentDue">Payment Due:</label>
          <input
            name="paymentDueDate"
            type="text"
            id="paymentDue"
            className="form-control"
            value={formData.paymentDueDate}
            onChange={handleInputChange}
          />
        </div>

        {/* Billed To */}
        <h2>Billed To:</h2>
        <div className="form-group">
          <label htmlFor="billedEmail">Email:</label>
          <input
            type="email"
            name="clientEmail"
            id="ClientEmail"
            className="form-control"
            placeholder="Enter email ..."
            value={formData.clientEmail}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Invoice Items */}
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
                onChange={(e) => handleItemsChange(e, index)}
                required
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
                onChange={(e) => handleItemsChange(e, index)}
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
                onChange={(e) => handleItemsChange(e, index)}
                required
              />
            </div>
            <button type="button" onClick={() => handleDeleteItem(index)}>
              <FaTrash />
            </button>
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
            name="taxes"
            type="Number"
            id="taxes"
            className="form-control"
            value={formData.taxes}
            onChange={handleInputChange}
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
export default UpdateInvoice;
