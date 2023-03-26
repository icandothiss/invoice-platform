import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewInvoice from "./pages/NewInvoice";
import Invoices from "./pages/Invoices";
import Invoice from "./pages/Invoice";
import InvoiceToPay from "./pages/InvoiceToPay";
import UpdateInvoice from "./pages/UpdateInvoice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmail from "./pages/ConfirmEmail";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route
              path="/new-invoice"
              element={
                <PrivateRoute>
                  <NewInvoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <PrivateRoute>
                  <Invoices />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice/update/:invoiceId"
              element={
                <PrivateRoute>
                  <UpdateInvoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice/:invoiceId"
              element={
                <PrivateRoute>
                  <Invoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice/:invoiceId/pay"
              element={
                <PrivateRoute>
                  <InvoiceToPay />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
