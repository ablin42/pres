import React, { useState } from "react";
import moment from "moment";
import generateUsers from "data/users";
import generateChats from "data/chats";
import styled from "styled-components";

import ClubLogoSvg from "icons/club-logo.svg";
import UserInterface from "types/users";
import ChatInterface from "types/chats";
import MessageInterface from "types/messages";
import Discussion from "./Discussion";

const MessageWrapper = styled.div`
  width: 400px;
  padding: 10px 30px;
  cursor: pointer;

  &:hover {
    background-color: white !important;
  }
`;

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

const Header = styled.div`
  width: 100%;
  text-align: center;
`;

const Self = styled.div`
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center; ;
`;

interface LandingPageProps {
  users: UserInterface[];
  chats: ChatInterface[];
  messages: MessageInterface[];
}

const LandingPage = ({ users, chats, messages }: LandingPageProps) => {
  const [currentChat, setCurrentChat] = useState(chats[0]);

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

  const extractPreviewChatData = () =>
    chats.map((chat) => {
      const user = users.find((user) => user.id === chat.withUser);
      const lastMessage = messages.find(
        (message) => message.id === chat.lastMessage
      );

      return { user, lastMessage, chat };
    });

  const createChatComponent = () => {
    const data = extractPreviewChatData().sort(
      (a, b) => +a.lastMessage.date - +b.lastMessage.date
    );

    return data.map((entry) => {
      const { user, lastMessage, chat } = entry;

      return (
        <MessageWrapper
          key={chat.id}
          onClick={() => setCurrentChat(chat)}
          style={{
            backgroundColor: currentChat.id === chat.id ? "white" : "initial",
          }}
        >
          <UserName>{user.name}</UserName>
          <ImgWrapper style={{ marginTop: "10px" }} src={user.profilePicture} />
          {chat.isActive ? " on" : " off"}
          <div>{lastMessage.content}</div>
          <div style={{ fontSize: "13px", color: "#a7a7a7" }}>
            {moment(lastMessage.date).fromNow()}
          </div>
        </MessageWrapper>
      );
    });
  };

  return (
    <div style={{ backgroundColor: "#161616" }}>
      <div
        className="w-100"
        style={{ backgroundColor: "#161616", padding: "3em 6em 6em 6em" }}
      >
        <Header>
          <ClubLogoSvg className="w-[100px] m-auto" />
          <h1 className="mt-[8px]" style={{ color: "#234DE6" }}>
            The Revolutionary Chat App
          </h1>
        </Header>
        <div
          className="container sm flex flex-row m-auto mt-4"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
            height: "calc(100vh - 200px)",
          }}
        >
          <div className="flex flex-row">
            <div
              style={{ width: "400px", overflowY: "auto", overflowX: "hidden" }}
            >
              <Self>
                <ImgWrapper
                  style={{ borderRadius: "50%" }}
                  src="https://i.imgur.com/IEHLKgL.png"
                />
                <b className="ml-3" style={{ fontSize: "18px" }}>
                  Andréas Blin
                </b>
              </Self>
              <div
                style={{
                  textAlign: "center",
                  color: "#858585",
                  marginTop: "-15px",
                  paddingBottom: "5px",
                }}
              >
                {chats.length} chats
              </div>
              {createChatComponent()}
            </div>
          </div>
          <Discussion
            users={users}
            messages={messages}
            chats={chats}
            currentChat={currentChat}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = () => {
  // This is only an exemple of how you could pass data from server to client,
  // you may create another page and not use that use
  const users: UserInterface[] = generateUsers();
  const {
    chats,
    messages,
  }: { chats: ChatInterface[]; messages: MessageInterface[] } = generateChats();

  return {
    props: {
      users,
      chats,
      messages,
    },
  };
};

export default LandingPage;
