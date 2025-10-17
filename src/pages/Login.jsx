import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen overflow-hidden max-w-[100%]">
      <div
        className=" min-h-screen max-w-[100%] flex overflow-hidden container"
        style={{
          backgroundImage: "url('/nespak-house.jpg')",
        }}
      >
        <div className="flex bg-[#fff] flex-col gap-3 p-7 rounded-md my-auto md:w-1/2 ml-auto">
          <img className="h-15 w-22" src="/nespak-logo.png" alt="my-img" />
         <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-black">Sign in to your account</h1>
          <h3 className="text-sm text-secondary">Manage your projects and job sites.</h3>
         </div>
          <div className="flex text-secondary flex-col gap-1">
            <label htmlFor="name" className="font-medium text-sm">Email:</label>
            <input placeholder="Email or username" type="email" className="p-2 ring ring-gray-300 w-full rounded-md outline-none text-sm md:text-sm text-secondary font-medium" />
          </div>
          <div className="flex text-gray-700 flex-col gap-1">
            <label htmlFor="name" className="font-medium text-sm">Password:</label>
            <input placeholder="Password" type="password" className="p-2 ring ring-gray-300 w-full rounded-md outline-none text-sm md:text-sm text-secondary font-medium" />
          </div>
          <div className="flex text-sm text-secondary justify-between">
            <div className="flex gap-2 items-center font-medium">
                <input type="checkbox" className="outline-none border-none  accent-primary cursor-pointer h-4 w-4" /> Remember me
            </div>
            <Link className="font-medium duration-500 underline hover:text-primary">Forgot Password?</Link>
          </div>
          <button className="bg-primary p-2 rounded-md text-white font-medium outline-none border-none">Sign in</button>
        <div className="flex items-center justify-center gap-2">
            <div className="h-[2px] w-full mt-1 bg-gray-300"></div>
            <h3 className="whitespace-nowrap text-secondary">Or sign in with</h3>
            <div className="h-[2px] w-full mt-1 bg-gray-300"></div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
