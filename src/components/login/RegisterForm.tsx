import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { UserDetailsInterface } from "../../interfaces/interfaces";
import { API_URL } from "../../reusable/urls";

const RegisterForm: React.FC = () => {
  // References to input elements
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const pwdRef = useRef<HTMLInputElement | null>(null);
  // Reference to p displaying validation messages
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  // Message variable
  const [message, setMessage] = useState("");
  // User input variable
  const [credentials, setCredentials] = useState<UserDetailsInterface>({
    firstName: undefined,
    username: undefined,
    email: undefined,
    password: undefined,
  });

  // Sets focus on the firstName field when component mounts
  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  // Handles changes in inputs and updates credentials on each keypress
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCredentials({
      ...credentials,
      /* Event targets use the same name as credentials object properties.
       * Sets the value of the current input to responding credentials property
       */
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent, url: string) => {
    // Prevents reloading of page on submit
    e.preventDefault();
    // Set message instead of default validation error from server
    if (credentials.password?.length) {
      if (credentials.password.length < 8) {
        // Refocus the password field
        if (pwdRef.current) {
          pwdRef.current.focus();
        }
        setCredentials({ ...credentials, password: "" });
        return setMessage("Password must be at least 8 characters");
      }
    }
    try {
      const res = await axios.post(
        url,
        { ...credentials },
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res);
      setMessage(`Registration successful`);
    } catch (err: any) {
      // For special type of database duplicate key error for unique fields
      if (err.response.data.includes("E11000")) {
        setMessage("Account already registered with this email");
      } else {
        setMessage(err.response.data);
      }
    }
  };

  return (
    <div className="my-5">
      <h2 className="text-white text-center">Register</h2>
      <p
        ref={messageRef}
        className="text-white text-center"
        style={!message ? { visibility: "hidden" } : { visibility: "visible" }}
      >
        {message}
      </p>

      <form
        className="w-100 m-auto"
        onSubmit={(e) => handleSubmit(e, API_URL("register"))}
      >
        <div className="form-group">
          <label className="text-white">First name:</label>
          <input
            ref={firstNameRef}
            className="form-control my-3"
            type="text"
            name="firstName"
            value={credentials.firstName}
            onChange={handleChange}
            required
          />
          <label className="text-white">Username:</label>
          <input
            className="form-control my-3"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <label className="text-white">Email:</label>
          <input
            ref={emailRef}
            className="form-control my-3"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
          <label className="text-white">Password:</label>
          <input
            ref={pwdRef}
            className="form-control my-3"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <input className="btn btn-light" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};
export default RegisterForm;
