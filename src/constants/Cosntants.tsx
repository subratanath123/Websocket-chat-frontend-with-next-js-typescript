
export type User = {
    email: string,
    userName: string,
    designation: string,
    picture: string,
};

export type ChatMessage = {
    content: string,
    senderEmail: string,
    type: 'CHAT' | 'LEAVE' | 'JOIN',
    created: string
};
