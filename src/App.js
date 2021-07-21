import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { PASSWORD_API } from "./api/password";

import { get } from "lodash";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";

import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function App() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(true);

  const [score, setScore] = useState(null);
  const [timeString, setTimeString] = useState("");
  const [warning, setWarning] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fragment, setFragment] = useState(false);
  const [strength, setStrength] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, showMessage] = useState(false);

  //for ProgressBar
  const [variant, setVariant] = useState("");
  const [now, setNow] = useState(null);

  //for Data
  const [fontColor, setFontColor] = useState("");

  //for Submit Button
  const [disable, setDisable] = useState(true);
  const [buttonColor, setColorButton] = useState("submit_disable");

  //for Modal
  const [show, setShow] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const passwordData = async (password) => {
    // console.log(password);
    if (password.length <= 0 || password === "") {
      setScore(null);
      setTimeString("");
      setWarning("");
      setSuggestions([]);
      setFragment(false);
    } else {
      const pass = { password: password };

      try {
        const response = await PASSWORD_API.password_checker.post(
          "/password/strength",
          pass
        );
        // console.log(response.data);
        setScore(response.data.score);
        setTimeString(response.data.guessTimeString);
        setWarning(response.data.warning);

        let suggestions = get(response, "data.suggestions", []);
        setSuggestions(suggestions);
        //console.log(suggestions);

        if (suggestions.length > 0) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }

        if (response.data.guessTimeString === "") {
          showMessage(false);
        } else {
          showMessage(true);
        }
        // console.log(response.data.suggestions);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
    if (visible === true) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setPassword(event.target.value);
    passwordData(event.target.value);
  };

  useEffect(() => {
    if (password === "") {
      setScore(null);
      setFragment(false);
      setShowSuggestions(false);
      showMessage(false);
    } else {
      setFragment(true);
      if (score === null) {
        setVariant(null);
        setNow(null);
        setShowSuggestions(false);
        showMessage(false);
        setStrength("");
        setDisable(true);
        setColorButton("submit_disable");
      } else if (score === 0) {
        setVariant("danger");
        setNow(20);
        setStrength("Your password is very weak!");
        setFontColor("danger");
        setDisable(true);
        setColorButton("submit_disable");
      } else if (score === 1) {
        setVariant("danger");
        setNow(40);
        setStrength("Your password is weak!");
        setFontColor("danger");
        setDisable(true);
        setColorButton("submit_disable");
      } else if (score === 2) {
        setVariant("warning");
        setNow(55);
        setStrength("Your password's strength is average!");
        setFontColor("average");
        setDisable(false);
        setColorButton("submit_able");
        setModalHeading("Great Job!");
        setModalMessage(
          "Your password's strength is average. Make sure to change it from time to time or achieve greater but making it stronger."
        );
      } else if (score === 3) {
        setVariant("success");
        setNow(70);
        setStrength("Your password's strength is strong!");
        setFontColor("success");
        setDisable(false);
        setColorButton("submit_able");
        setModalHeading("Wooohooo, Congratulations!");
        setModalMessage(
          "Your password's strength is strong. You know what's better than a strong password? A VERY STRONG password!"
        );
      } else if (score === 4) {
        setVariant("success");
        setNow(100);
        setStrength("Your password's strength is very strong!");
        setFontColor("success");
        setDisable(false);
        setColorButton("submit_able");
        setModalHeading("Wow, that's Perfect!");
        setModalMessage(
          "You have now a very strong password. Not all can make this but make sure not to forget it."
        );
      }
    }
  }, [score, password]);

  return (
    <div className='login-register-wrapper'>
      <div className='title'>
        <h3 id='loginBtn'>Is Your Password Strong Enough?</h3>
      </div>
      <div className='form-group'>
        <div id='loginform'>
          <React.Fragment>
            <span>
              <input
                type={values.showPassword ? "text" : "password"}
                id='password'
                placeholder='Enter Your Password'
                value={password}
                onChange={handlePasswordChange("password")}
              />
              <p id='icon' onClick={handleClickShowPassword}>
                {visible ? (
                  <BsEyeFill></BsEyeFill>
                ) : (
                  <BsEyeSlashFill></BsEyeSlashFill>
                )}
              </p>
            </span>

            <div>
              {score !== null ? (
                <ProgressBar variant={variant} now={now} />
              ) : (
                <ProgressBar now={0} />
              )}
            </div>
          </React.Fragment>
        </div>

        {fragment ? (
          <div>
            <React.Fragment>
              <div className='data' id='data'>
                <h5 id={fontColor}>
                  <b>{strength}</b>
                </h5>

                {message ? (
                  <p>
                    It will take <b>{timeString}</b> to guess your password.{" "}
                    {warning}
                  </p>
                ) : (
                  <p></p>
                )}

                {showSuggestions === true ? (
                  <div id='suggestions_block'>
                    <p id='suggestions_title'>Recommendation/s:</p>
                    <p>
                      {suggestions.map((list, i) => (
                        <li key={i}>{list}</li>
                      ))}
                    </p>
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            </React.Fragment>
          </div>
        ) : (
          <div>
            <React.Fragment>
              <div className='data' id='data'></div>
            </React.Fragment>
          </div>
        )}
        <button
          type='submit'
          value='submit'
          className='submit'
          id={buttonColor}
          // onClick={() => passwordData(password)}
          onClick={handleShow}
          disabled={disable}
        >
          Submit
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title id={fontColor}>
              <b>{modalHeading}</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
