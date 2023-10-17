// @ts-check
import "./style.css";
import React, {useState} from "react";
import {addPublicRoom} from "../../../../../../api";

/**
 * @param {{ active: boolean; room: import('../../../../../../state').Room; onClick: () => void; }} props
 */
const AddRoom = ({user, onClick}) => {
    //const { online, name, lastMessage, userId } = useAddRoom(room);
    const [roomName, setRoomName] = useState('');
    const AddRoomSubmit = async (e) => {
        e.preventDefault();
        return await addPublicRoom(user.id, roomName);

    }


    return (
        <div
            onClick={(e) => onClick}
            className={`add-room d-flex align-self-center p-2 rounded bg-white  ": ""
      }`}
        >

            <form id={"AddRoom"} className={"w-100"} onSubmit={(e) => AddRoomSubmit(e)}>
                <b className={"mx-auto d-block"}>Room creation</b>
                <hr/>
                <div className="align-self-center mx-auto pl-1 form-group">
                    <input type={"text"} placeholder={"Room name"} name={"room-name"}
                           onChange={(e) => setRoomName(e.target.value)} className={"form-control"}/>
                </div>
                <div className="align-self-center mx-auto pl-1 form-group">
                    <input type={"submit"} value={"Create room"} className={"form-control"}
                           disabled={roomName.length < 3}/>
                </div>
            </form>
        </div>)
}

export default AddRoom;