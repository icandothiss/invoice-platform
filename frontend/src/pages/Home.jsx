import { Link } from "react-router-dom";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";

function Home() {
  return (
    <>
      <section className="heading">
        <h1>What do you need help with?</h1>
        <p>Please choose from an option below</p>
      </section>

      <Link to="/new-invoice" className="btn btn-reverse btn-block">
        <FaQuestionCircle /> Create New Invoice
      </Link>
      <Link to="/invoices" className="btn btn-block">
        <FaTicketAlt /> View My Invoices
      </Link>
    </>
  );
}

export default Home;
