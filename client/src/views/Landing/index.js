import React, { useCallback,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoomAPI } from "../../api/room";

const Landing = ({ currentUserId }) => {

  useEffect(() => {
    //eslint-disable-next-line
    if ((sessionStorage.length == "")) {
    window.location.href = "./sign-in";
  } //url
}, []);

    const navigate = useNavigate()

  //eslint-disable-next-line
    const handleLogoutBtnClick = useCallback(async () => {
      console.log('Logoutbtn clicked');
      window.location.href = "./sign-in";
      window.sessionStorage.clear();
      window.localStorage.clear();
    });

    const createRoom = useCallback(async () => {
        try {
            const roomInformation = await createRoomAPI(currentUserId);
            navigate(`/rooms/${roomInformation.roomId}`);
        }
        catch (error) {
            console.error(error);
        }
    }, [currentUserId, navigate]);

    return (
      <div className="container">
      <h2>Meet Your Friends</h2> 
         <input type="text" placeholder="Enter Room Code"/>
         
          <button onClick={createRoom} className="button is-success">Create a room</button>

          <button type="submit" >
            Call Up
          </button>

             
        <form  className="box2" >
         
         <button  type="submit" variant="primary" onClick={handleLogoutBtnClick}>
         LogOut
          </button>   
          
        </form> 
     

      </div>
      );
};
export default Landing;
