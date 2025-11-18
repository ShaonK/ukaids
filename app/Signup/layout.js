import React from "react";

const SignupLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-black text-white relative">
      {children}
    </div>
  );
};

export default SignupLayout;
