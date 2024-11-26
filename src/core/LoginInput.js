import React from "react";

const LoginInput = ({ labelName, inputType, placeholder, style, value, onChange }) => {
  return (
    <>
      {labelName && (
        <label style={{ float: "left", marginBottom: "0", color: "#999999" }}>
          {labelName}
        </label>
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        style={style}
        value={value} // Bind the value prop
        onChange={onChange} // Bind the onChange prop
      />
    </>
  );
};

export default LoginInput;