import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, {params}) => {
    try{
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate('creator')
        if(!prompt){
            return new Response("Prompt not found", {status: 404})
        }

        return new Response(JSON.stringify(prompt, {statue: 200}));

    }catch(err){
        return new Response("Error while fetching Prompts.", {status: 500})
    }
}

export const PATCH = async(request, {params}) => {
    try{
        await connectToDB();
        const { prompt, tag } =  await request.json();
        const existingPrompt = await Prompt.findById(params.id)

        if(!existingPrompt){
            return new Response("Prompt Not Found", {status: 404})
        }
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), {status: 200})
    }catch(err){
        console.log(err);
        return new Response("Unable to update Prompt. Internal Server Error.", {status : 500})
    }
}

export const DELETE = async(request, {params}) => {
    try{
        await connectToDB();
        await Prompt.findByIdAndDelete(params.id)

        return new Response("Prompt Deleted Succesfully", {status: 200})
    }
    catch(err){
        console.log(err);
        return new Response("Unable to Delete Prompt", {status: 500})
    }
}