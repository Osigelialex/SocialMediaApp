import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Alert } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import API_BASE_URL from "../../apiConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    // prevent page from refreshing
    e.preventDefault();

    // send Post request to login endpoint
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    };

    fetch(`${API_BASE_URL}/auth/login`, requestOptions)
      .then((resp) => {
        if (!resp.ok) {
          setIsValid(false);
        }
        return resp.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setIsValid(true);
          localStorage.clear();
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // store the users data in localStorage
          localStorage.setItem("userData", JSON.stringify(data.user));
          history.push("/home");
        }
      });
  };

  return (
    <div className="min-h-screen grid place-items-center font-roboto bg-darkthemetext">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-4/6 lg:w-1/2 xl:w-1/2 shadow-sm rounded-lg mx-auto p-8"
      >
        <h2 className="font-bold text-2xl text-center my-5">
          Sign in to NetLink
        </h2>
        {!isValid && <Alert severity="error">Invalid email or password</Alert> }
        <div className="my-4">
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={email}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="my-4">
          <div className="flex justify-between">
            <label className="font-medium mb-2">Password</label>
            <Link
              to="/requestpasswordreset"
              className="font-light mb-2 cursor-pointer text-sm"
            >
              Forgotten Password?
            </Link>
          </div>

          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </div>
        <input
          type="submit"
          value="Login"
          className="bg-blue-800 p-3 my-3 w-full text-white font-bold cursor-pointer hover:bg-blue-600"
        />
        <p className="text-sm font-light text-center mt-5">
          Don&apos;t have a NetLink account?
          <Link to="/signup" className="font-medium cursor-pointer">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
