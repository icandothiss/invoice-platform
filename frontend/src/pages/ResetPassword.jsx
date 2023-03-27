import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function ResetPassword() {
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [searchParams, setSearchParams] = useSearchParams();
  searchParams.get("token");

  let token = searchParams.get("token");

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const onChange = (e) => {
    setPassword(e.target.value);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("password has been changed.");
    } else if (message) {
      toast.error(message);
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ token, password }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Reset password
        </h1>
        <p>Please enter your new password</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default ResetPassword;
