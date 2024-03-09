"use client"

import React, {useState} from 'react';

import Fab from '@mui/material/Fab';

import {MDBContainer} from 'mdb-react-ui-kit';

import {StompSessionProvider,} from "react-stomp-hooks";
import {SignInButton} from "@/component/SignInButton";
import ChatUserList from "@/component/ChatUserList";
import {useSession} from "next-auth/react";

const style = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000, // Adjust the z-index as needed
};

// https://hpcodes.medium.com/send-messages-from-spring-boot-backend-to-reactjs-app-using-websocket-4120f6979c9b

export default function App() {
    const {data: session} = useSession();

    const [state, setState] = useState<{

        chatMaximized: boolean,
        showUserList: boolean

    }>({
        chatMaximized: false,
        showUserList: false
    });

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };


    const SOCKET_URL = 'http://localhost:8000/websocket';

// @ts-ignore
    return (
        <StompSessionProvider url={SOCKET_URL}>
            <SignInButton/>

            <MDBContainer className="py-5">
                {
                    !state.chatMaximized && !state.showUserList && session && session.user
                    &&
                    <div style={style} onClick={(e) => {
                        setState({...state, showUserList: true})
                    }}>
                        <Fab variant="extended">
                            Live chat
                        </Fab>
                    </div>
                }

                {
                    <ChatUserList
                        onClick={toggleDrawer}
                        showUserList={state.showUserList}
                        onDrawerClose={() => {setState({...state, showUserList: false})}}
                        onChatMaximized={() => {setState({...state,  showUserList: false, chatMaximized: true})}}
                        onChatMinimized={() => {setState({...state,  showUserList: false, chatMaximized: false})}}
                    />
                }


            </MDBContainer>
        </StompSessionProvider>
    );
}
