import React from 'react'
import { Calendar } from "@/components/ui/calendar"
import { useState } from 'react'
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect } from 'react';

const GameSchedule = () => {
  const [date, setDate] = useState(new Date())
  const [isCalendarToggled, setIsCalendarToggled] = useState(false)
  const [todaysDate, setTodaysDate] = useState()
  const [selectedLocalDate, setSelectedLocalDate] = useState()

  useEffect(() => {
    if(date) console.log(date)
    const td = date.toString().split(" ")
    const fullTdDate = `${td[1]} ${td[2]}, ${td[3]}`
    console.log(fullTdDate)
    setTodaysDate(fullTdDate)
    setSelectedLocalDate(date?.toLocaleDateString())
    let localDate = date?.toLocaleDateString()
    localDate = localDate.replace(/\//g, "-")
    setSelectedLocalDate(localDate)
  }, [date])

  useEffect(() => {
    if (selectedLocalDate) {
      setSelectedLocalDate(selectedLocalDate.replace(/\//g, "-"))
      console.log(selectedLocalDate)
    }
  }, [selectedLocalDate]);

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col py-20 px-16 md:px-20 lg:px-24 xl:px-32 2xl:px-48">
        <div className="flex gap-5 rounded-md" >
          <div className="bg-red-400 grid grid-cols-3 items-center " >
            Todays Games.
          </div>
          <div
            onClick={() => setIsCalendarToggled(!isCalendarToggled)} 
            className="flex gap-1 outline outline-2 outline-gray-800 hover:cursor-pointer items-center bg-gray-500 hover:bg-gray-400/75 rounded-md p-1 ">
            <IoCalendarOutline />
            <IoIosArrowDown size={12} />
          </div>
        </div>

        <div className="flex justify-center" >
          {
            isCalendarToggled && (
              <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mt-3 ml-16"
            />
            )
          }
        </div>

          <div className="flex flex-col mt-6" > 
            {
              todaysDate && (
                <h1>{todaysDate}</h1>
              )
            }
          </div>
      </div>
    </div>
  )
}

export default GameSchedule