import React from 'react';
import Linkify from "linkify-react";

type MessageRowProps = {
    message: string;
    avatarLink?: string;
    isMe: boolean;
};

const MessageRow: React.FC<MessageRowProps> = ({
                                                   isMe,
                                                   message,
                                                   avatarLink = "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                               }) => {
    const options = {
        target: '_blank',
        rel: 'noopener noreferrer'
    };

    return (
        <div className={`d-flex flex-row ${isMe ? "justify-content-start" : "justify-content-end"} mb-4`}>

            {
                isMe && <img
                    className="rounded-circle shadow-4-strong"
                    src={avatarLink}
                    alt="avatar 1"
                    style={{width: "45px", height: "100%"}}
                />
            }

            <div
                className="p-3 me-3 border"
                style={{borderRadius: "15px", backgroundColor: "#fbfbfb"}}
            >
                <p className="small mb-0">
                    <Linkify options={options}>{message}</Linkify>;
                </p>
            </div>

            {
                !isMe && <img
                    className="rounded-circle shadow-4-strong"
                    src={avatarLink}
                    alt="avatar 1"
                    style={{width: "45px", height: "100%"}}
                />
            }

        </div>
    )
};

export default MessageRow;
