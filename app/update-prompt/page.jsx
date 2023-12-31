"use client"
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

import Form from '@Components/Form'

const UpdatePrompt = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    })
    const searchParams = useSearchParams();
    const promptId = searchParams.get('id');

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`api/prompt/${promptId}`)
            const data = await response.json();
            setPost({
                prompt: data.prompt,
                tag: data.tag
            })
        }
        if(promptId){
            getPromptDetails();
        }
    },[promptId])

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`/api/prompt/${promptId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        prompt: post.prompt,
                        userId: session?.user.id,
                        tag: post.tag
                    })
                })
            if (response.ok) {
                router.push('/');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <Form
            type="Update"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
    )
}

export default UpdatePrompt