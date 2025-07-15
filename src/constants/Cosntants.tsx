
export type User = {
    email: string,
    userName: string,
    designation: string,
    picture: string,
};

import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        access_token?: string;
        picture?: any;
    }
}

export type ChatMessage = {
    content: string,
    senderEmail: string,
    type: 'CHAT' | 'LEAVE' | 'JOIN',
    created: string
};


// types.ts

export type Project = {
    id: string;
    projectName: string;
    embedWebsite: string;
    embedWebsiteUrl: string;
    websiteToTrain: string;
    file: File | null;
    description: string;
    chatBotName: string;
    chatBotImageUrl: string;
};

export type ProjectTrainingInfo = {
    projectName: string;
    projectId: string;
    email: string;
    childPageUrl: string;
    created: string;
};

export type ProjectOverview = {
    project: Project;
    projectTrainingInfoList: ProjectTrainingInfo[];
};
