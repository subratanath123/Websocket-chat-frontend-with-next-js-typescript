"use client"

import React, {useState} from 'react';

import Fab from '@mui/material/Fab';

import {MDBContainer} from 'mdb-react-ui-kit';

import {StompSessionProvider,} from "react-stomp-hooks";
import ChatUserList from "@/component/ChatUserList";
import {useSession} from "next-auth/react";
import ChatService from "@/component/ChatService";

const style = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000, // Adjust the z-index as needed
};

// https://hpcodes.medium.com/send-messages-from-spring-boot-backend-to-reactjs-app-using-websocket-4120f6979c9b

export default function App() {

// @ts-ignore
    return (
        <>
        </>
    );
}
