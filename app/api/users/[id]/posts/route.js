import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, {params}) => {
    try{
        await connectToDB();
        const prompts = await Prompt.find({creator: params.id}).populate('creator')

        return new Response(JSON.stringify(prompts, {statue: 200}));

    }catch(err){
        return new Response("Error while fetching Prompts.", {status: 500})
    }
}