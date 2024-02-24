import { useState } from "react";
import { Link } from "react-router-dom";

const requestPasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const requestOptions = {
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };

    fetch(
      `${API_BASE_URL}/auth/request-password-reset`,
      requestOptions
    )
      .then((resp) => resp.json())
  };

  return (
    <div className="min-h-screen grid place-items-center font-roboto bg-darkthemetext">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-4/6 lg:w-1/2 xl:w-1/2 shadow-sm rounded-lg mx-auto mt-11 p-8"
      >
        <h2 className="font-bold text-2xl text-center mb-7">
          Reset your password
        </h2>
        <div className="my-4">
          <label className="block text-left font-medium mb-2">
            Email address
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="block p-2 w-full border text-black"
            required
          />
        </div>
        <input
          type="submit"
          value="Send Reset Link"
          className="bg-blue-800 p-3 my-3 w-full text-white font-bold cursor- hover:bg-blue-600 cursor-pointer"
        />
        <p className="text-sm font-light text-center mt-5">
          <Link to="/" className="font-medium cursor-pointer">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default requestPasswordReset;
