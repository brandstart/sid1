import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  let navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordLengthRequirement = 8;
    return password.length >= passwordLengthRequirement;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!validateEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!validatePassword(password)) {
      errors.password = "Password should be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length === 0) {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        const responseData = await response.json();
        setErrors({ api: responseData.message });
      }
    }

    setErrors(errors);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      {errors.name && <p>{errors.name}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password}</p>}
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
      {errors.api && <p>{errors.api}</p>}
      <button type="submit">Register</button>
    </form>
  );
}

export default Registration;
