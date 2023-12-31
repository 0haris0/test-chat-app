// @ts-check
const bcrypt = require('bcrypt');
const {
    incr, set, hmset, sadd, hmget, exists, client: redisClient, zadd, get,
} = require('./redis');

/** Redis key for the username (for getting the user id) */
const makeUsernameKey = (username) => {
    const usernameKey = `username:${username}`;
    return usernameKey;
};

/**
 * Creates a user and adds default chat rooms
 * @param {string} username
 * @param {string} password
 */
const createUser = async (username, password) => {
    const usernameKey = makeUsernameKey(username);
    /** Create user */
    const hashedPassword = await bcrypt.hash(password, 10);
    const nextId = await incr("total_users");
    const userKey = `user:${nextId}`;
    await set(usernameKey, userKey);
    await hmset(userKey, ["username", username, "password", hashedPassword]);

    /**
     * Each user has a set of rooms he is in
     * let's define the default ones
     */
    await sadd(`user:${nextId}:rooms`, `${0}`); // Main room

    /** This one should go to the session */
    return {id: nextId, username};
};

const getPrivateRoomId = (user1, user2) => {
    if (isNaN(user1) || isNaN(user2) || user1 === user2) {
        return null;
    }
    const minUserId = user1 > user2 ? user2 : user1;
    const maxUserId = user1 > user2 ? user1 : user2;
    return `${minUserId}:${maxUserId}`;
};

const createPublicRoom = async (user, roomName) => {
    let nextIdRoom = await incr("total_global_rooms");
    await set(`room`, nextIdRoom);
    await set(`room:${nextIdRoom}:name`, roomName);
    await sadd(`user:${user}:rooms`, `${nextIdRoom}`);
    const totalUsers = await get(`total_users`);
    for (let i = 0; i < totalUsers; i++) {
        await sadd(`user:${i}:rooms`, `${nextIdRoom}`);
    }
    return [{
        id: nextIdRoom, name: roomName, messages: null,
    }]
};

/**
 * Create a private room and add users to it
 * @returns {Promise<[{
 *  id: string;
 *  names: any[];
 * }, boolean]>}
 */
const createPrivateRoom = async (user1, user2) => {
    const roomId = getPrivateRoomId(user1, user2);

    if (roomId === null) {
        return [null, true];
    }

    /** Add rooms to those users */
    await sadd(`user:${user1}:rooms`, `${roomId}`);
    await sadd(`user:${user2}:rooms`, `${roomId}`);

    return [{
        id: roomId, names: [await hmget(`user:${user1}`, "username"), await hmget(`user:${user2}`, "username"),],
    }, false];
};

const checkVariableEmpty = (stringVar) => {
    return stringVar !== '' && stringVar.length < 3;
}

const getMessages = async (roomId = "0", offset = 0, size = 50) => {
    /**
     * Logic:
     * 1. Check if room with id exists
     * 2. Fetch messages from last hour
     **/
    const roomKey = `room:${roomId}`;
    const roomExists = await exists(roomKey);
    if (!roomExists) {
        return [];
    } else {
        return new Promise((resolve, reject) => {
            redisClient.zrevrange(roomKey, offset, offset + size, (err, values) => {
                if (err) {
                    reject(err);
                }
                resolve(values.map((val) => JSON.parse(val)));
            });
        });
    }
};

const sanitise = (text) => {
    let sanitisedText = text;

    if (text.indexOf('<') > -1 || text.indexOf('>') > -1) {
        sanitisedText = text.replace(/</g, '&lt').replace(/>/g, '&gt');
    }

    return sanitisedText;
};

module.exports = {
    getMessages,
    sanitise,
    createUser,
    checkVariableEmpty,
    makeUsernameKey,
    createPrivateRoom,
    createPublicRoom,
    getPrivateRoomId
};
