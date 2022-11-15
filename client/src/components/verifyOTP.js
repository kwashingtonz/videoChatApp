import React, { Component } from "react";
import "./style.css";

export default class VerifyOTP extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            userId: "",
            otp: "",
            otpData: {},
            user: {},
            
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    //this.reSendOTPSubmit = this.resSendOTPSubmit.bind(this);
    }

  componentDidMount() {

    const userData = JSON.parse(window.sessionStorage.getItem("userdata"));
    const otpData = JSON.parse(window.sessionStorage.getItem("otpdata"));
    const userId = otpData.userId
    const email = userData.email

    this.setState({ email: email, userId: userId ,otpData:otpData, user:userData}); 
  }

  handleSubmit(e) {
    e.preventDefault();
    const { userId, otp } = this.state;
    console.log(userId, otp);
    fetch("http://localhost:3000/user/verifyOTP", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
         otp: this.state.otp,
         userId: userId,
         //token: window.sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
    
        console.log(data, "verifyOTP");
        if (data.status === "VERIFIED") {
            alert("Verification Successful");
            window.location.href = "./userDetails";
        }else{
            alert("Verification Unsuccessful");
        }
      });


  }

//     resSendOTPSubmit(e) {
//     e.preventDefault();
//     const {userId, email} = this.state;
//     console.log(userId, email);
//     fetch("http://localhost:3000/user/resendOTPVerificationCode", {
//       method: "POST",
//       crossDomain: true,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         "Access-Control-Allow-Origin": "*",
//       },
//       body: JSON.stringify({
//         userId,
//         email,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data, "OTP Send");
//         if (data.status === "ok") {
//           alert("re-send OTP successful");
//           window.localStorage.setItem("token", data.act);
//           window.location.href = "./VerifyOTP";
//         }
//       });
//   }
  
  render() {
    return (
      
      <div>
      <form onSubmit={this.handleSubmit}>
    
    <meta charSet="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    
        <h3>OTP Verification</h3>

        <div className="mb-3">
          <label>Your Email</label>
           <h4>{this.state.user.email}</h4>
        </div>

        <div className="mb-3">
          <label>Enter OTP Code</label>
        </div>
       <div className="OTP">

       <script src="main.js"></script>

        <div className="otp-field">

            <input type="text" maxLength="4" onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                    }
                }} onChange={(e) => this.setState({ otp: e.target.value })}
            />
        
          </div>

        </div> <br></br>
        
          <button type="submit" variant="primary" className="btn btn-primary">
            Verify
          </button>{' '}
        </form>
        
        <form>
         
         <button type="submit" variant="primary" className="btn btn-warning resend" >
            Re-Send
          </button>
          
        </form> 
         
         
    
    </div>
      
    );
}
}