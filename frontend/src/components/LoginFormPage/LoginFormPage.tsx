import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import "./LoginForm.css";



function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useAppSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const serverResponse = await dispatch(
      thunkLogin({
        credential: email,
        password,
      })
    );
    
    if (serverResponse?.errors) {
      setErrors(serverResponse);
      navigate("/signup");
    }
      navigate("/home");
    
  };
  const handleDemoLogin = async () => {
    const demoEmail = "ron@weasley.com";
    const demoPassword = "password";
    const res = await dispatch(
      thunkLogin({ email: demoEmail, password: demoPassword })
    );
    if (!res?.errors) {
      navigate("/home");
    }
  };
  return (
    <div className="login-form-container">
      <h1>Log In</h1>
      {errors.length > 0 &&
        errors.map((message:string) => <p key={message}>{message}</p>)}
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <div className='button-container'>

        <button type="submit">Log In</button>
        <button type="button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        </div>
        <div className='demo-button'>
        <button type="button" onClick={handleDemoLogin}>
          Demo Login
        </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormPage;
