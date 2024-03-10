"use client";

import React, {Suspense, useEffect, useRef, useState} from "react";
import {MDBCard, MDBCardBody, MDBCol, MDBRow} from "mdb-react-ui-kit";
import ChatHeader from "@/component/ChatHeader";
import MessageRow from "@/component/MessageRow";
import ChatTextAreaBox from "@/component/ChatTextAreaBox";
import Fab from "@mui/material/Fab";
import {ChatMessage, User} from "@/constants/Cosntants";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {useSession} from "next-auth/react";
import {Skeleton} from "@mui/material";
import {Session} from "next-auth";
import axios from "axios";

interface ChatWindowProps {
    chatWithUser: User,
    onCloseChat: (user: User) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({chatWithUser, onCloseChat}) => {
    const {data: session} = useSession();
    const selfEmail = session?.user?.email;
    const token = session?.access_token;
    const myPicture = session?.picture;

    const [state, setState] = useState<{

        chatMaximized: boolean,
        showUserList: boolean,
        fetchedData: boolean;
        messages: ChatMessage[],
        text: string

    }>({
        chatMaximized: false,
        showUserList: false,
        fetchedData: false,
        messages: [],
        text: ''
    });

    const stompClient = useStompClient();
    const cardRef = useRef(null);

    // Function to scroll the card to the bottom
    const scrollToBottom = () => {
        if (cardRef.current) {
            cardRef.current.scrollTop = cardRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        // Scroll to the bottom when component mounts or when messages change
        scrollToBottom();
    }, [state.messages]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/api/get-recent-messages/${chatWithUser.email}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`
                    }
                });

                setState((prevState) => ({...prevState, fetchedData: true, messages: response.data}));

            } catch (error) {
                console.error('Fetching messages failed:', error);
            }
        };

        fetchData();

    }, [chatWithUser.email]);

    const sendMessage = (msg: any) => {
        if (stompClient && msg.toString().trim().length > 1) {
            let chatMessageString = `{
                "content": "${msg.replace(/\n/g, '\\n')}",
                "senderEmail": "${selfEmail}",
                "type": "CHAT",
                "token": "${token}"
            }`;

            setState((prevState) => ({...prevState, text: ''}));

            stompClient.publish({
                destination: '/app/user-message-' + chatWithUser.email, body: chatMessageString
            })
        }
    }

    useSubscription('/queue/reply-' + selfEmail,
        (message) => {

            let chatMessage: ChatMessage = JSON.parse(message.body);

            setState((prevState) => ({...prevState, messages: [...prevState.messages, chatMessage]}));

            scrollToBottom();
        }
    );

    return (
        <MDBRow className="d-flex justify-content-center">
            <MDBCol md="10" lg="10" xl="10" style={{minWidth: "300px"}}>
                <MDBCard id="chat1" style={{borderRadius: "15px", maxWidth: "600px"}}>
                    <ChatHeader
                        title={`${chatWithUser.userName} (${chatWithUser.email})`}
                        handleClick={(event) => {
                            onCloseChat(chatWithUser);
                        }}/>


                    <MDBCardBody>
                        <div ref={cardRef} className="overflow-y-scroll"
                             style={{maxHeight: "300px", minHeight: "300px"}}>
                            {
                                state.messages
                                &&
                                state.messages.map((message, index) => {
                                    return <MessageRow key={`message ${index}`}
                                                       avatarLink={message.senderEmail == selfEmail ? myPicture : chatWithUser.picture}
                                                       message={message.content}
                                                       isMe={message.senderEmail == selfEmail}/>;
                                })
                            }
                        </div>

                        {
                            !state.fetchedData
                                ? (
                                    <>
                                        <div >
                                            <span class="spinner-border spinner-border-sm" role="status"
                                                  aria-hidden="true"></span>
                                               &nbsp; Loading...
                                        </div>
                                    </>
                                )
                                : (
                                    <>
                                        <ChatTextAreaBox
                                            text={state.text}
                                            handleTextChange={(e) => {
                                                setState({...state, text: e.target.value})
                                            }}/>
                                        <MDBRow className="d-flex justify-content-end" style={{marginTop: "12px"}}>
                                            <Fab variant="extended" color="primary" onClick={(event) => {
                                                sendMessage(state.text)
                                            }}>
                                                Send
                                            </Fab>
                                        </MDBRow>
                                    </>
                                )
                        }
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        </MDBRow>
    );
};

export default ChatWindow;