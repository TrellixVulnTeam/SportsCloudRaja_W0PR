import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    HashRouter,
} from "react-router-dom";
import { Network } from '../../../Services/Api';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { logoutUser } from "../../../Redux/Actions/auth";
import '../../../Utils/css/style.css';
import '../../../Utils/css/responsive.css';
import "../../../Utils/css/bootstrap.min.css"
import "../../../Utils/css/bootstrap-datepicker.css"
import TeamList from "../../../images/team-list.png"
import SideMenuComponents from "../../../Components/SideMenu"
import flag from "../../../images/flag.png"
import UserProfile from "../../../images/user-profile.png"
import './viewCalender.css'

const ViewCalender =()=>{
    const history = useHistory()
    const dispatch = useDispatch()
    const [userMe, setUser] = useState(null);
    const [user, setUserData] = useState({});
    const [player, setPlayer] = useState([]);
    const [resData, setResData] = useState({})
    const [nonPlayer, setNonPlayer] = useState([])
    const [dropdown, setDropdown] = useState([])
    const [teamDropdown, setTeamDropDown] = useState("")
    const [team, setTeam] = useState([]);




    // const [Nonplayer,setNonPlayer]= useState([]);

    useEffect(() => {
        // let user = userdata && userdata._id ? true : false;
        // console.log("userMe===>", user);
        setUser(user);
        // console.log("USerData", userdata);
        const userLocal = JSON.parse(localStorage.getItem("user"));
        console.log("userData after login--->", userLocal)
        let userD = userLocal && userLocal._id ? true : false;
        setUser(userD);
        setUserData(userLocal);
        teamSelect()
        teamRoster();
       
       

    }, []);

    const pic = 'https://nodeserver.mydevfactory.com:1447/'

    const handleLogout = () => {
        // console.log("pruyuuuuuu", props);
        // dispatch(logoutUser(null));
        localStorage.removeItem("user");
        setUserData(null);
        history.push("/")
    };
    const teamRoster = (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("id---->",id)
        if (user) {
            let header = {
                'authToken': user.authtoken

            }
            console.log('user', user)

            Network('api/player-list-by-team-id?team_id=' + id, 'GET', header)
                .then(async (res) => {
                    console.log("teamRoster----", res)

                    if (res.response_code == 4000) {
                        dispatch(logoutUser(null))
                        localStorage.removeItem("user");
                        history.push("/")
                        toast.error(res.response_message)
                    }
                    setResData(res.response_data);
                    console.log("team player", res.response_data.PLAYER)
                    console.log("non player", res.response_data.NON_PLAYER)
                    setPlayer(res.response_data.PLAYER)
                    setNonPlayer(res.response_data.NON_PLAYER)


                })
        }
    }



    const teamSelect = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            let header = {
                'authToken': user.authtoken

            }
            console.log('user', user)

            Network('api/player-joined-team-list?player_id=' + user._id, 'GET', header)
                .then(async (res) => {
                    console.log("res----", res)
                    if (res.response_code == 4000) {
                        dispatch(logoutUser(null))
                        localStorage.removeItem("user");
                        history.push("/")
                        toast.error(res.response_message)
                    }

                    setTeam(res.response_data);
                    // if(res.response_data.length!=0){
                        teamRoster(res.response_data[0]._id);
                    // }
                   

                })
        }
    }

    

    const change = (event) => {
        console.log("event", event.target.value)
        setTeamDropDown(event.target.value)
        teamRoster(event.target.value);
    }
    return(
        <div class="prefarance-box player-info" style={{ height: "100%", marginTop: "0px", borderRadius: "0px" }}>
            <SideMenuComponents manger="manger" />
            <div class="dashboard-main-content">
                <div class="dashboard-head">
                    <div class="teams-select">
                        <button class="create-new-team" onClick={() => history.push("./CreateTeam")}>Create New Teams</button>

                        <select onClick={change}>
                                    <option>Select Team</option>
                                    {team.map((team) => {
                                        return (
                                            <option value={team.team_id._id}>{team.team_id.team_name}</option>
                                        )
                                    })}


                                </select>
                        <select>
                            <option>Account</option>
                            <option>Account 2</option>
                            <option>Account 3</option>
                        </select>
                    </div>

                    <div class="profile-head">
                        <div class="profile-head-name">{user ? user.fname : null}</div>
                        <div class="profile-head-img">
                            {
                                user ?
                                    <img src={user.profile_image} alt="" /> :
                                    <img src={UserProfile} alt="" />
                            }

                        </div>
                    </div>
                    <div class="login-account">
                        <ul>
                            <li><a href="#" data-toggle="modal" data-target="#myModallogin" onClick={handleLogout}>Logout</a></li>
                            {/* <li><a href="#" data-toggle="modal" data-target="#myModalregister" onClick={handleLogout}>Logout</a></li> */}
                        </ul>
                    </div>
                </div>
                </div>
            
        </div>

    )
}

export default ViewCalender ;