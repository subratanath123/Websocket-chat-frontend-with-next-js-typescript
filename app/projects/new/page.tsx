'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBFile,
    MDBInput,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBTextArea,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Header from '@/component/Header';
import LeftNavBar from '@/component/LeftNavBar';
import Footer from '@/component/Footer';
import ChatService from '@/component/ChatService';
import { useRouter } from 'next/navigation';

export default function CreateProject() {// inside your React component
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.access_token;

    const [activeTab, setActiveTab] = useState('pdf');

    const [formState, setFormState] = useState<{
        projectName: string;
        embedWebsite: string;
        embedWebsiteUrl: string;
        websiteToTrain: string;
        file: File | null;
        description: string;
        chatBotName: string;
        chatBotImageUrl: string;
    }>({
        projectName: '',
        embedWebsite: '',
        websiteToTrain: '',
        embedWebsiteUrl: '',
        file: null,
        description: '',
        chatBotName: '',
        chatBotImageUrl: '',
    });

    const handleTabChange = (value: string) => {
        if (value !== activeTab) setActiveTab(value);
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFormState(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('projectName', formState.projectName);
        formData.append('embedWebsiteUrl', formState.embedWebsiteUrl);
        formData.append('chatBotName', formState.chatBotName);
        formData.append('chatBotImageUrl', formState.chatBotImageUrl);
        formData.append('websiteToTrain', formState.websiteToTrain);
        formData.append('description', formState.description);
        if (formState.file) formData.append('file', formState.file);

            const response = await axios.post(
                'http://localhost:8000/api/projects/create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then(response => {
                const projectId = response.data.id;
                if (projectId) {
                    router.push(`/projects/${projectId}`);
                }
            }).catch(reason => {
                alert('Error: ' + reason.message);
            });

    };

    return (
        <>
            <Header />
            <LeftNavBar />

            <MDBContainer className='mt-5'>
                <form onSubmit={handleSubmit}>
                    <h4 className='mb-4'>Create Personalized Chatbot Project</h4>

                    <MDBInput
                        label='Project Name'
                        name='projectName'
                        value={formState.projectName}
                        onChange={handleInputChange}
                        className='mb-4'
                        required
                    />

                    <MDBInput
                        label='Target Website Where Chatbot Will Be Embedded'
                        name='embedWebsiteUrl'
                        value={formState.embedWebsiteUrl}
                        onChange={handleInputChange}
                        className='mb-4'
                        required
                    />

                    <MDBInput
                        label='Chatbot Name'
                        name='chatBotName'
                        value={formState.chatBotName}
                        onChange={handleInputChange}
                        className='mb-4'
                        required
                    />

                    <MDBInput
                        label='ChatBotImageUrl'
                        name='chatBotImageUrl'
                        value={formState.chatBotImageUrl}
                        onChange={handleInputChange}
                        className='mb-4'
                        required
                    />

                    <MDBTabs pills className='mb-3'>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => handleTabChange('website')}
                                active={activeTab === 'website'}
                            >
                                Train by Website
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => handleTabChange('pdf')}
                                active={activeTab === 'pdf'}
                            >
                                Upload PDF
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink
                                onClick={() => handleTabChange('description')}
                                active={activeTab === 'description'}
                            >
                                Provide Description
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                        <MDBTabsPane open={activeTab === 'website'}>
                            <MDBInput
                                label='Website URL to Train'
                                name='websiteToTrain'
                                value={formState.websiteToTrain}
                                onChange={handleInputChange}
                                className='mb-4'
                                type='url'
                            />
                        </MDBTabsPane>

                        <MDBTabsPane open={activeTab === 'pdf'}>
                            <MDBFile
                                label='Upload PDF File'
                                id='file-input'
                                onChange={handleFileChange}
                                className='mb-4'
                            />
                        </MDBTabsPane>

                        <MDBTabsPane open={activeTab === 'description'}>
                            <MDBTextArea
                                label='Custom Text or Project Description'
                                name='description'
                                value={formState.description}
                                onChange={handleInputChange}
                                className='mb-4'
                                rows={5}
                            />
                        </MDBTabsPane>
                    </MDBTabsContent>

                    <MDBBtn type='submit' block>
                        Create & Train Chatbot
                    </MDBBtn>
                </form>
            </MDBContainer>
            <Footer />
        </>
    );
}
