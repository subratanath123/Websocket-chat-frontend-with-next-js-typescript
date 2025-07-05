"use client"

import {ChangeEvent, FormEvent, useState} from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBFile,
    MDBInput,
    MDBTabs,
    MDBTabsContent,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsPane,
    MDBTextArea
} from 'mdb-react-ui-kit';
import axios from "axios";
import {useSession} from "next-auth/react";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import LeftNavBar from "@/component/LeftNavBar";
import ChatService from "@/component/ChatService";


export default function Profile() {
    const [state, setState] = useState<{
        webSite: string,
        file: File | null,
        description: string,
    }>({
        webSite: '',
        file: null,
        description: '',
    });

    const {data: session} = useSession();
    const token = session?.access_token;
    const myPicture = session?.picture;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('webSite', state.webSite);
        formData.append('description', state.description);
        formData.append('file', state.file);

        axios.post('http://localhost:8000/api/openai/train', formData, {
            headers: {
                'Authorization': `Bearer ${session?.access_token}`
            }
        })
            .then((response) => {
                alert(response.data);
            })
            .catch((error) => {
                alert("Error :" + error);
            });
    };

    const [basicActive, setBasicActive] = useState('tab1');

    const handleBasicClick = (value: string) => {
        if (value === basicActive) {
            return;
        }

        setBasicActive(value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setState({
                ...state,
                file: e.target.files[0]
            });
        }
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {

        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

// @ts-ignore
    return (
        <>
            <Header/>
            <LeftNavBar/>

            <MDBContainer className="mt-5">
                <form>
                    <MDBTabs pills className='mb-3'>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                                Website
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                                Pdf
                            </MDBTabsLink>
                        </MDBTabsItem>
                        <MDBTabsItem>
                            <MDBTabsLink onClick={() => handleBasicClick('tab3')} active={basicActive === 'tab3'}>
                                Text
                            </MDBTabsLink>
                        </MDBTabsItem>
                    </MDBTabs>

                    <MDBTabsContent>
                        <MDBTabsPane open={basicActive === 'tab1'}>
                            <MDBInput className='mb-4'
                                      type='text'
                                      id='form1Example1'
                                      label='Website address'
                                      name="webSite"
                                      onChange={(e) => handleTextChange(e)}
                            />

                        </MDBTabsPane>
                        <MDBTabsPane open={basicActive === 'tab2'}>
                            <div>
                                <MDBFile
                                    label="File Input"
                                    id="file-input"
                                    onChange={(e) => handleFileChange(e)}
                                    required
                                    className="mb-4"
                                />

                            </div>
                        </MDBTabsPane>
                        <MDBTabsPane open={basicActive === 'tab3'}>
                            <MDBTextArea
                                label="Description"
                                id="text-input"
                                value={state.description}
                                name="description"
                                onChange={(e) => handleTextChange(e)}
                                required
                                className="mb-4"
                            />
                        </MDBTabsPane>
                    </MDBTabsContent>

                    <MDBBtn type='submit' block onClick={e => handleSubmit(e)}>
                        Train
                    </MDBBtn>
                </form>
            </MDBContainer>
            <Footer/>
        </>
    );
}
