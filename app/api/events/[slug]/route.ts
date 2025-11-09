import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

type RouteParams ={
    params: Promise<{
        slug: string
    }>
}

export async function GET(req: NextRequest , {params} : RouteParams){

    try {
        await connectDB()

        const {slug} = await params

        if(!slug || typeof slug !== 'string' || slug.trim() === ''){
            return NextResponse.json({message: 'Slug not found'},{status: 400})
        }

        const sanitizedSlug = slug.trim().toLowerCase()

        const event = await Event.findOne({slug: sanitizedSlug}).lean()

        //handle event not found
        if(!event){
            return NextResponse.json({
                message:`Event with slug ${sanitizedSlug} not found.`
            },
        {status:404})
        }

        //return successful response with event data
        return NextResponse.json(
            {message:'Event fetched successfully',event},
            {status:200}
        )


    } catch (error) {
        // log error for debugging (only in development)
        if(process.eventNames.NODE_ENV =='development'){
            console.error('Error fetching event by slug: ', error)
        }

        // Handle specific error types
                //handle specific error types
        if(error instanceof Error){
            //handle database connection errors
            if(error.message.includes('MONGODB_URI')){
                return NextResponse.json(
                    {message: 'Database configuration error'},
                    {status: 500}
                )
            }
        }


        // Return generic error with error message

        return NextResponse.json(
            {message:'Failed to fetch event', error: error.message},
            {status: 500})
    }


}