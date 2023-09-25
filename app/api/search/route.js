import User from "@models/user"
import Prompt from "@models/prompt"
import { connectToDB } from "@utils/database"


export const GET = async (request, { params }) => {

    const getUserAllprompts = async (users) => {
        let userPrompts = [];
        try{
            await Promise.all(users.map(async (user) => {
                const currentUserPrompts = await Prompt.find({creator: user._id}).populate("creator")
                userPrompts = userPrompts.concat(currentUserPrompts);
            }));
        }
        catch(err)
        {
            console.log(err);
        }
        return userPrompts;
    }
    const searchQuery = request.nextUrl.searchParams.get('searchQuery')
    try {
        await connectToDB();
        const searchPrompts = await Prompt.find({ $or: [{ prompt: { "$regex": searchQuery, "$options": "i" } }, { tag: { "$regex": searchQuery, "$options": "i" } }] }).populate('creator')
        const users =  await User.find({ username: { "$regex": searchQuery, "$options": "i" }  })
        const userPrompts = await getUserAllprompts(users);
        const tagSearch = await Prompt.find({tag: `#${searchQuery}`})
        const prompts = searchPrompts.concat(userPrompts, tagSearch);
        const id = [];
        const fileteredPrompts = prompts.filter((prompt) => {
            if(id.includes(prompt.id)){
                return false
            }

            id.push(prompt.id);
            return true;
        })
        return new Response(JSON.stringify(fileteredPrompts), { status: 200 })
    } catch (error) {
        console.log(error);
        return new Response("Error", { status: 500 })
    }
}