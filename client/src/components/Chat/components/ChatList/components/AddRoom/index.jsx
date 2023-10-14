// @ts-check
import "./style.css";
import React, {useMemo} from "react";

/**
 * @param {{ active: boolean; room: import('../../../../../../state').Room; onClick: () => void; }} props
 */
const AddRoom = ({roomData, onClick}) => {
    //const { online, name, lastMessage, userId } = useAddRoom(room);
    const AddRoomSubmit = (e) => {
        e.preventDefault();
        console.log(e);
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
                    <input type={"text"} placeholder={"Room name"} className={"form-control"}/>
                </div>
                <div className="align-self-center mx-auto pl-1 form-group">
                    <input type={"submit"} value={"Create room"} className={"form-control"}/>
                </div>
            </form>
        </div>)
}

export default AddRoom;