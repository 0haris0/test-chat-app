// @ts-check
import React, {useEffect, useState} from "react";
import ChatList from "./components/ChatList";
import MessageList from "./components/MessageList";
import TypingArea from "./components/TypingArea";
import useChatHandlers from "./use-chat-handlers";

/**
 * @param {{
 *  onLogOut: () => void,
 *  onMessageSend: (message: string, roomId: string) => void,
 *  user: import("../../state").UserEntry
 * }} props
 */
export default function Chat({onLogOut, user, onMessageSend}) {
  const [spamProtection, setSpamProtection] = useState(false);
  const [msgNumber, setMsgNumber] = useState(0);
  const {
    onLoadMoreMessages,
    onUserClicked,
    message,
    setMessage,
    rooms,
    room,
    currentRoom,
    dispatch,
    messageListElement,
    roomId,
    messages,
    users,
  } = useChatHandlers(user);

  useEffect(()=>{
    // Every 20 sec set message number to 0. This will restart if users have normal conversation
    setTimeout(()=>{setMsgNumber(0)},20000);
    // If sended more than 10 msg in less than 20 sec, it will activate spam protection, and needed to wait 10 sec for restart.
    if(msgNumber>10){
        setSpamProtection(true);
        setTimeout(()=>{setMsgNumber(0)},10000)
    }else{
      setSpamProtection(false);
    }
  }, [msgNumber])
  return (<div className="container py-5 px-4">
    <div className="chat-body row overflow-hidden shadow bg-light rounded">
      <div className="col-4 px-0">
        <ChatList
            user={user}
            onLogOut={onLogOut}
            rooms={rooms}
            currentRoom={currentRoom}
            dispatch={dispatch}
        />
      </div>
      {/* Chat Box*/}
      <div className="col-8 px-0 flex-column bg-white rounded-lg">
        <div className="px-4 py-4" style={{borderBottom: "1px solid #eee"}}>
          <h5 className=" mb-0">{room ? room.name : "Room"}</h5>
        </div>
        <MessageList
            messageListElement={messageListElement}
            messages={messages}
            room={room}
            onLoadMoreMessages={onLoadMoreMessages}
            user={user}
            onUserClicked={onUserClicked}
            users={users}
        />

        {/* Typing area */}
        <TypingArea
            message={message}
            setMessage={setMessage}
            spamProtect={spamProtection}
            onSubmit={(e) => {
              e.preventDefault();
              setMsgNumber(msgNumber+1);
              onMessageSend(message.trim(), roomId);
              setMessage("");
              messageListElement.current.scrollTop = messageListElement.current.scrollHeight;
            }}
        />
      </div>
    </div>
  </div>);
}
