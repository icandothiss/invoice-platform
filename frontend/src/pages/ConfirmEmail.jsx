import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { confirmEmail } from "../features/auth/authSlice";

function ConfirmEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  let token = user.confirmEmailToken;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Email is verified!");
      navigate("/");
    }
    if (isError) {
      toast.error(message);
    }
  }, [isError, message, dispatch, isSuccess]);

  const confirmEmailButton = () => {
    dispatch(confirmEmail(token));
  };

  if (token !== user.confirmEmailToken) {
    return (
      <>
        <section className="heading">
          <h1>
            <FaUser /> Confirm Email
          </h1>
          <p>Invalid or expired email confirmation token.</p>
        </section>
      </>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Confirm Email
        </h1>
        <p>Click to confirm your email</p>
      </section>

      <section className="form">
        <div className="form-group">
          <button className="btn btn-block" onClick={confirmEmailButton}>
            Confirm
          </button>
        </div>
      </section>
    </>
  );
}

export default ConfirmEmail;
