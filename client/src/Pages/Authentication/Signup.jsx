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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayname, setDisplayname] = useState("");
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
      body: JSON.stringify({ username, displayname, email, password }),
    };

    fetch(`${API_BASE_URL}/auth/signup`, requestOptions)
      .then((resp) => {
        if (!resp.ok) {
          setIsValid(false);
          return;
        }
        return resp.json();
      })
      .then((data) => {
        if (data.status === "fail") {
          return;
        }
        history.push("/");
      });
  };

  return (
    <div className="min-h-screen grid place-items-center font-roboto bg-darkthemetext">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-4/6 lg:w-1/2 xl:w-1/2 shadow-sm rounded-lg mx-auto mt-11 p-8"
      >
        <h2 className="font-bold text-2xl text-center mb-7">
          Create your NetLink account
        </h2>
        <div className="my-4">
          {!isValid && (
            <Alert severity="error" className="mb-3">
              A user with provided credentials already exists
            </Alert>
          )}
          <TextField
            id="outlined-basic"
            label="Email address"
            variant="outlined"
            value={email}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="my-4">
          <TextField
            id="outlined-basic"
            label="Pick a username"
            variant="outlined"
            value={username}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="my-4">
          <TextField
            id="outlined-basic"
            label="Pick a display name"
            variant="outlined"
            value={displayname}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setDisplayname(e.target.value);
            }}
          />
        </div>
        <div className="my-4">
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
          value="Sign up"
          className="bg-blue-800 p-3 my-3 w-full text-white font-bold cursor- hover:bg-blue-600 cursor-pointer"
        />
        <p className="text-sm font-light text-center mt-5">
          Already a NetLink member?{" "}
          <Link to="/" className="font-medium cursor-pointer">
            Sign in now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
