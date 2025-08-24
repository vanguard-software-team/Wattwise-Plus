import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../service/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      navigate("/overview");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='font-ubuntu w-96 p-10 bg-gray-100 border-4 border-gray-300 rounded-lg'
    >
      <h1 className='text-center text-2xl font-bold'>Log in</h1>
      <div className='mb-6'>
        <label
          htmlFor='email'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Your email
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-gray-50 border text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5'
          required
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='password'
          className='block mb-2 text-sm font-medium text-gray-900'
        >
          Your password
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='bg-gray-50 border text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5'
          required
        />
      </div>
      <div className='flex items-center mb-6'>
        <input
          id='remember'
          type='checkbox'
          className='w-4 h-4 border border-gray-300 rounded bg-gray-50'
        />
        <label
          htmlFor='remember'
          className='ml-2 text-sm font-medium text-gray-900'
        >
          Remember me
        </label>
      </div>
      <button
        type='submit'
        className='text-white bg-orange-400 hover:bg-gray-600 font-bold rounded-lg w-full px-5 py-2.5 text-center'
      >
        Login
      </button>
      {error && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded relative text-sm mt-5'
          role='alert'
        >
          <span className='block sm:inline'>{error}</span>
        </div>
      )}
      <p className='p-4 text-sm'>
        You don't have an account?{" "}
        <Link to='/register' className='text-blue-500 hover:font-semibold'>
          Sign Up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
