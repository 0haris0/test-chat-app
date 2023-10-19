// @ts-check
import React, {useMemo, useState} from "react";
import ChatListItem from "./components/ChatListItem";
import AddRoom from "./components/AddRoom";
import Footer from "./components/Footer";


const ChatList = ({rooms, dispatch, user, currentRoom, onLogOut}) => {
    const [roomCreatorVisible, roomCreatorVisibleHandler] = useState(false);
    const processedRooms = useMemo(() => {
        const roomsList = Object.values(rooms);
        const main = roomsList.filter((x) => !isNaN(x.id));
        let other = roomsList.filter((x) => isNaN(x.id));
        other = other.sort((a, b) => +a.id.split(":").pop() - +b.id.split(":").pop());
        return [...(main ? main : []), ...other];
    }, [rooms]);

    return (<>
            <div className="chat-list-container flex-column d-flex pr-4">
                <div className="py-2 d-md-inline-flex d-sm-block justify-content-between align-items-center">
                    <p className="h5 mb-0 py-1 chats-title">Rooms</p>
                    <div className={`btn btn-outline-info mr-0`}
                         onClick={() => roomCreatorVisibleHandler(!roomCreatorVisible)}>+ Add new room
                    </div>
                </div>
                <div className={"py-2 m-2 d-inline-block"}>
                    {roomCreatorVisible ? <AddRoom user={user} dispatch={dispatch} rooms={rooms}
                                                   visibleRoom={roomCreatorVisible}/> : null}
        </div>
        <div className="messages-box flex flex-1">
            <div className="list-group rounded-0">
                {processedRooms.map((room) => (<ChatListItem
                    key={room.id}
                    onClick={() => dispatch({type: "set current room", payload: room.id})}
                    active={currentRoom === room.id}
                    room={room}
                />))}
            </div>
        </div>
                <Footer user={user} onLogOut={onLogOut}/>
            </div>
        </>
    )

};

export default ChatList;
