import React, {ChangeEvent} from 'react';
import {MDBTextArea} from "mdb-react-ui-kit";

type ChatTextAreaBoxProps = {
    title?: string;
    text?: string;
    handleTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

const ChatTextAreaBox: React.FC<ChatTextAreaBoxProps> = ({
                                                             title = "Live Chat",
                                                             text,
                                                             handleTextChange
                                                         }) => {

    const onTextChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        handleTextChange(e);
    }

    return (
        <MDBTextArea
            value={text}
            onChange={onTextChange}
            className="form-outline"
            label="Type your message"
            id="textAreaExample"
            rows={3}
        />
    )
};

export default ChatTextAreaBox;
