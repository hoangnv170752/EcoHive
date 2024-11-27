import React, { useState } from "react";

const LoginInput = ({ labelName, inputType, placeholder, style, value, onChange }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      {labelName && (
        <label style={{ float: "left", marginBottom: "5px", color: "#999999" }}>
          {labelName}
        </label>
      )}
      <input
        type={inputType === "password" && isPasswordVisible ? "text" : inputType}
        placeholder={placeholder}
        style={{ ...style, paddingRight: inputType === "password" ? "40px" : "10px" }} // Add padding for the icon if password
        value={value}
        onChange={onChange}
      />
      {inputType === "password" && (
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#999999",
          }}
        >
          {isPasswordVisible ? (
            <i className="fa fa-eye-slash" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-eye" aria-hidden="true"></i>
          )}
        </span>
      )}
    </div>
  );
};

export default LoginInput;