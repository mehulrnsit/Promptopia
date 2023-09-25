
"use client";

import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Loading from "./loading";

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();
            setMyPosts(data);
        }
        if (session?.user.id) {
            fetchPost();
        }
    }, []);

    useEffect(() => {
        if (!session) {
            router.push("/");
        }
    }, [session])

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are You sure you want to Delete this Prompt!");
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE"
                })
                const filteredPosts = myPosts.filter((currPost) => currPost._id !== post._id)
                setMyPosts(filteredPosts)
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <Suspense fallback={<Loading />}>
            <Profile
                name='My'
                desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
                data={myPosts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </Suspense>

    )
}

export default MyProfile