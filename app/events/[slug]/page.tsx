import Image from "next/image"
import { notFound } from "next/navigation"
import BookEvent from '../../../components/BookEvent'
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions"
import { IEvent } from "@/database"
import EventCard from "@/components/EventCard"


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({icon, label, alt}: {icon:string, alt:string, label:string})=>{
return <div className="flex-row-gap-2 items-center">
  <Image src={icon} alt={alt} width={17} height={17}/>
  <p>{label}</p>
</div>
}

const EventAgenda = ({agendaItems}:{agendaItems: string[]})=>(
  <div className="agenda">
<h2>Agenda</h2>
<ul>
  {agendaItems.map((item,index)=>(
    <li key={index}>{item}</li>
  ))}
</ul>
  </div>
)


const EventTags = ({tags}:{tags: string[]})=>(
<div className="flex flex-row gap-1.5 flex-wrap">
  {tags.map((tag)=>(
    <div className="pill" key={tag}>{tag}</div>
  ))}
</div>
)

const EventDetailsPage  = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params

  // const response = await fetch(`${BASE_URL}/api/events/${slug}`)

  let event;
try {
  const request = await fetch(`${BASE_URL}/api/events/${slug}`,{
    next: {revalidate: 60}
  })

  if(!request.ok){
    if(request.status == 404){
      return notFound()
    }
    throw new Error(`failed to fetch event : ${request.statusText}`)
  }

  const response = await request.json()
  event = response.event

  if(!event){
    return notFound()
  }
  
} catch (error) {
  console.error('Error fetching event', error);
  return notFound()
}
  // const {event : {title, description, overview, image,venue, location, date, time, mode, audience, agenda, organizer, tags}}= await response.json()
  const  {title, description, overview, image,venue, location, date, time, mode, audience, agenda, organizer, tags}= event


  // if(!event) return notFound()
  if(!description) return notFound()

 
    const bookings = 10
  
    const similarEvents :IEvent[] = await getSimilarEventsBySlug(slug)

    console.log("!@#!@#!@#!#!#!@#!@# ****************",similarEvents)

  return (
    <section id="event">
      {/* <h1>Event Details: <br /> {slug}</h1> */}
      <div className="header">
        <h1>Event Description</h1>
        <p > {description}</p>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner"/>

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-span-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" alt="Calender" label={date}/>
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time}/>
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location}/>
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience}/>
          </section>

          <EventAgenda agendaItems={agenda}/>
          {/* <EventAgenda agendaItems={JSON.parse(agenda[0])}/> */}

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags}/>
          {/* <EventTags tags={JSON.parse(tags[0])}/> */}
        </div>


        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) :(
              <p className="text-sm">Be the first to book your spot!</p>

            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&  similarEvents.map((similarEvent : IEvent)=>(
            <EventCard key={similarEvent._id} {...similarEvent}/>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetailsPage