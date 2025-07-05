'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MDBContainer, MDBSpinner } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ProjectOverview } from '@/constants/Cosntants';
import SingleProjectOverview from '@/component/SingleProjectOverview';
import Header from '@/component/Header';
import LeftNavBar from '@/component/LeftNavBar';
import Footer from '@/component/Footer';
import ChatService from "@/component/ChatService";

export default function ProjectDetailPage({params}: { params: { id: string } }) {
    const { data: session } = useSession();

    const [overview, setOverview] = useState<ProjectOverview | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchProjectOverview = async () => {
            try {
                const response = await axios.get<ProjectOverview>(`http://localhost:8000/api/projects/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });
                setOverview(response.data);
            } catch (error) {
                console.error('Failed to load project overview:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectOverview();
    }, [params.id, session]);

    return (
        <>
            <Header />
            <LeftNavBar />
            <MDBContainer className='mt-5 mb-4'>
                {loading ? (
                    <div className='text-center mt-5'>
                        <MDBSpinner color='primary' role='status' />
                        <div className='mt-2'>Loading project details...</div>
                    </div>
                ) : (
                    overview && <SingleProjectOverview overview={overview} />
                )}
            </MDBContainer>

            <ChatService projectId={overview?.project?.id}/>

            <Footer />
        </>
    );
}
