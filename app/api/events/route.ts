import connectDB from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";
import Event from "../../../database/event.model";
import {v2 as cloudinary} from 'cloudinary'
import { resolve } from "path";
import { rejects } from "assert";

export async function POST(req: NextRequest){
    try {

        await connectDB()

        const formData = await req.formData()

        let event;

        try {
            event = Object.fromEntries(formData.entries())
            console.log(event)

        } catch (error) {
            return NextResponse.json({message: 'Invalid JSON data format'}, {status: 400})
        }

        const file = formData.get('image') as File

        if(!file){
            return NextResponse.json({message:'Image file is requried.'},{status: 400})
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadResult = await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({resource_type:'image',folder:'DevEvent'},(error,results)=>{
                if(error) return reject(error)

                resolve(results)
            }).end(buffer)
        }) 

        event.image = (uploadResult as {secure_url: string}).secure_url

        const createdEvent = await Event.create(event)

        return NextResponse.json({message: 'Event created succesfully', event: createdEvent},{status: 201})
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:'Event Creation Failed.', error: error instanceof Error ? error.message :'unknown'}, {status: 500})
    }
}


export async function GET(req: NextRequest){
    try {
        await connectDB()

        const events = await Event.find().sort({createdAt: -1})

        return NextResponse.json({message:'Event list successfully.', events},{status: 200 })
        
    } catch (error) {
        return NextResponse.json({message:'Error while fetching the data.',error: error},{status: 500})
    }
}