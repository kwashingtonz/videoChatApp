import React, { Component } from "react";
import "./style.css";

export default class VerifyOTP extends Component {

  constructor(props) {
      super(props);
      this.state = {
          otp: {},
          user: {},
         
      };
    
    }

  componentDidMount() {

    const userData = JSON.parse(window.localStorage.getItem("userdata"));
    const otpData = JSON.parse(window.localStorage.getItem("otpdata"));

    this.setState({otp:otpData, user:userData}); 

  }
  
  render() {
    return (
      <form >
    
    <meta charSet="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    
        <h3>OTP Verification</h3>

        <div className="mb-3">
          <label>Your Email</label>
           <h3>{this.state.user.email}</h3>
          <input
            type="text"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Enter OTP Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter OTP"
            // onChange={(e) => this.setState({ otp: e.target.value })}
          />
        </div>
       <div className="OTP">
        <div className="otp-field">
        <script src="main.js"></script>
          <input type="text" maxLength="1"/>
          <input type="text" maxLength="1"/>
          <input type="text" maxLength="1"/>
          <input type="text" maxLength="1"/>
        
          </div>

        </div> <br></br>
        
          <button type="submit" variant="primary" className="btn btn-primary">
            Verify
          </button>{' '}
        
          <button type="submit" variant="primary" className="btn btn-primary">
            Re-Send
          </button>
        
        
        <p className="forgot-password text-right">
          Don't need to verify Now! <a href="/sign-in">Skip</a>
        </p>
      </form>
      
    );
}
}