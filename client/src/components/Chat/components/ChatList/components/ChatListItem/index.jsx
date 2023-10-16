// @ts-check
import "./style.css";
import React, {useMemo} from "react";
import {useAppState} from "../../../../../../state";
import moment from "moment";
import {useEffect} from "react";
import {getMessages} from "../../../../../../api";
import AvatarImage from "../AvatarImage";
import OnlineIndicator from "../../../OnlineIndicator";

/**
 * @param {{ active: boolean; room: import('../../../../../../state').Room; onClick: () => void; }} props
 */
const ChatListItem = ({room, active = false, onClick}) => {
    const {online, name, lastMessage, userId} = useChatListItemHandlers(room);
    return (<div
        onClick={onClick}
        className={`chat-list-item d-md-flex row d-sm-block align-items-start rounded ${active ? "bg-white" : ""}`}
    >
        <div className="align-self-sm-top align-self-center col-1">
            <OnlineIndicator online={online} hide={room.id === "0"}/>
        </div>
        <div className="align-self-center col-2  d-none d-sm-block">
            <AvatarImage name={name} id={userId}/>
        </div>
        <div className="media-body col-8">
            <h5 className="text-truncate font-size-14 mb-1 font-weight-bolder">{name}</h5>
            <div className="font-size-14 font-italic">{lastMessage && (
                <p className="text-truncate mb-0">- {lastMessage.message} </p>)}</div>
        </div>
        <div className="col-1 d-none d-sm-block">
            {lastMessage && (<div className="font-size-11">
                {moment.unix(lastMessage.date).format("LT")}
            </div>)}
        </div>
    </div>);
};

const useChatListItemHandlers = (/** @type {import("../../../../../../state").Room} */ room) => {
    const {id, name} = room;
    const [state] = useAppState();

    /** Here we want to associate the room with a user by its name (since it's unique). */
    const [isUser, online, userId] = useMemo(() => {
        try {
            let pseudoUserId = Math.abs(parseInt(id.split(":").reverse().pop()));
            const isUser = pseudoUserId > 0;
            const usersFiltered = Object.entries(state.users)
                .filter(([, user]) => user.username === name)
                .map(([, user]) => user);
            let online = false;
            if (usersFiltered.length > 0) {
                online = usersFiltered[0].online;
                pseudoUserId = +usersFiltered[0].id;
            }
            return [isUser, online, pseudoUserId];
        } catch (_) {
            return [false, false, "0"];
        }
    }, [id, name, state.users]);

    const lastMessage = useLastMessage(room);

    return {
        isUser, online, userId, name: room.name, lastMessage,
    };
};

const useLastMessage = (/** @type {import("../../../../../../state").Room} */ room) => {
    const [, dispatch] = useAppState();
    const {lastMessage} = room;
    useEffect(() => {
        if (lastMessage === undefined) {
            /** need to fetch it */
            if (room.messages === undefined) {
                getMessages(room.id, 0, 1).then((messages) => {
                    let message = null;
                    if (messages.length !== 0) {
                        message = messages.pop();
                    }
                    dispatch({
                        type: "set last message", payload: {id: room.id, lastMessage: message},
                    });
                });
            } else if (room.messages.length === 0) {
                dispatch({
                    type: "set last message", payload: {id: room.id, lastMessage: null},
                });
            } else {
                dispatch({
                    type: "set last message", payload: {
                        id: room.id, lastMessage: room.messages[room.messages.length - 1],
                    },
                });
            }
        }
    }, [lastMessage, dispatch, room]);

    return lastMessage;
};

export default ChatListItem;
