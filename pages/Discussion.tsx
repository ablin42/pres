import React, { useState } from "react";
import styled from "styled-components";

import ChatInterface from "types/chats";
import MessageInterface from "types/messages";
import UserInterface from "types/users";

const ImgWrapper = styled.img`
  width: 50px;
  height: 50px;
  float: right;
`;

const UserName = styled.b`
  color: #234de6;
  font-size: 18px;
`;

const SingleMsg = styled.div`
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #ffffff;
  width: fit-content;
  border-radius: 10px;
  display: flex;
`;

const DiscussionWrapper = styled.div`
  background-color: "#f9f9f9";
  display: flex;
  flex-direction: column;
  width: 800px;
  padding: 0 40px 40px 40px;
  font-size: 18px;
  border-left: 1px solid #e1e1e1;
  overflowy: auto;
  overflowx: hidden;
`;

interface LandingPageProps {
  users: UserInterface[];
  chats: ChatInterface[];
  currentChat: ChatInterface;
  messages: MessageInterface[];
}

const Discussion = ({ users, chats, messages, currentChat }: LandingPageProps) => {

  const extractChatData = (chat) => {
    const chatMessages = messages
      .filter((message) => message.chatId === chat.id)
      .sort((a, b) => +a.date - +b.date);
    const user = users.find((user) => user.id === chat.withUser);

    return { chatMessages, user };
  };

  const openChat = (chat) => {
    const { chatMessages, user } = extractChatData(chat);

    const msgList = chatMessages.map((message) => {
      const { writtenByMe } = message;

      return (
        <div
          key={message.id}
          className="flex"
          style={{ justifyContent: writtenByMe ? "end" : "start" }}
        >
          <SingleMsg
            style={{
              backgroundColor: writtenByMe ? "#4424d021" : "#ffffff",
              flexDirection: writtenByMe ? "row-reverse" : "row",
              margin: "5px 0",
            }}
          >
            <img
              style={{
                width: "25px",
                height: "25px",
                margin: writtenByMe ? "0 0 0 10px" : "0 10px 0 0",
                borderRadius: "15px",
              }}
              src={
                writtenByMe
                  ? "https://i.imgur.com/IEHLKgL.png"
                  : user.profilePicture
              }
            />
            {message.content}
          </SingleMsg>
        </div>
      );
    });

    return (
      <>
        <div
          className="m-2 pb-1 flex justify-center"
          style={{ borderBottom: "1px solid #e1e1e1" }}
        >
          <div className="flex p-3 align" style={{ alignItems: "center" }}>
            <ImgWrapper className="mr-3" src={user.profilePicture} />
            <UserName>{user.name}</UserName>
          </div>
        </div>
        {msgList}
      </>
    );
  };

  return (
    <DiscussionWrapper
      className="flex flex-col w-100"
      style={{ width: "100%" }}
    >
      {openChat(currentChat)}
    </DiscussionWrapper>
  );
};


export default Discussion;
