import React from 'react'
import { Calendar } from "@/components/ui/calendar"
import { useState } from 'react'
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScheduleTableHeaders } from '../assets/constants/ScheduleTable';
import { getTeamLogo } from '../assets/constants/TeamLogos';

const GameSchedule = () => {
  const [date, setDate] = useState(new Date())
  const [isCalendarToggled, setIsCalendarToggled] = useState(false)
  const [todaysDate, setTodaysDate] = useState()
  const [selectedLocalDate, setSelectedLocalDate] = useState()
  const [scheduleData, setScheduleData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const GetScheduleByDate = () => {
    try {
      if(selectedLocalDate) {
        console.log(typeof selectedLocalDate)
        setIsLoading(true)
        fetch(`https://nba-stats-backend-production.up.railway.app/api/schedule?date=${selectedLocalDate}`)
          .then(res => res.json())
          .then(data => {
            console.log("data: ", JSON.parse(data))
            setScheduleData(JSON.parse(data))
          })
          .catch(err => console.log(err))
          .finally(() => setIsLoading(false))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(date) console.log(date)
    const td = date.toString().split(" ")
    const fullTdDate = `${td[1]} ${td[2]}, ${td[3]}`
    console.log(fullTdDate)
    setTodaysDate(fullTdDate)
    setSelectedLocalDate(date?.toLocaleDateString())
    let localDate = date?.toLocaleDateString()
    localDate = localDate.replace(/\//g, "-")
    const splitLocalDate = localDate.split("-")
    const finalLocalDate = `${splitLocalDate[2]}-${splitLocalDate[0]}-${splitLocalDate[1]}`
    setSelectedLocalDate(finalLocalDate)
  }, [date])

  useEffect(() => {
    if (selectedLocalDate) {
      setSelectedLocalDate(selectedLocalDate.replace(/\//g, "-"))
      console.log(selectedLocalDate)
    }
    GetScheduleByDate()
  }, [selectedLocalDate]);

  return (
    <div className="h-screen w-screen">
      <div className="flex flex-col py-20 px-16 md:px-20 lg:px-24 xl:px-40 2xl:px-80 ">
        <div className="relative">

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

          <div className="flex justify-center absolute z-10" >
            {
              isCalendarToggled && (
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mt-4 ml-24 md:ml-80"
              />
              )
            }
          </div>
        </div>

          <div className="flex flex-col mt-6 bg-zinc-900 outline outline-[.5px] outline-gray-500 " > 
            <div className="mt-2">
              {
                todaysDate && (
                  <h1 className="px-4 text-gray-400 text-lg pb-2 border-b-[.5px] border-zinc-700" >{todaysDate}</h1>
                )
              }
            </div>

            <Table>
              <TableHeader>
                <TableRow className=" border-b-[.5px] border-zinc-700  hover:bg-zinc-800/60">
                  {
                    ScheduleTableHeaders.map((tableHeader, index) => (
                      <TableHead key={index}>{tableHeader}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {
                  scheduleData && scheduleData.map((game,index) => (
                    <TableRow key={index} className="outline outline-gray-500 outline-[.5px] hover:bg-zinc-800">
                      <TableCell className="flex gap-2 text-gray-400 items-center" >
                        <div className="rounded-full overflow-hidden flex items-center">
                          <img
                            className="object-cover h-6 w-6"
                            src={getTeamLogo(game?.VISITOR_TEAM_NAME?.abbreviation)} 
                          />
                        </div>
                        {game?.VISITOR_TEAM_NAME?.nickname}
                      </TableCell>
                      <TableCell className="">
                        <div className=" flex gap-2 text-gray-400 items-center">
                          <div className="rounded-full overflow-hidden">
                            <img
                              className="object-cover h-6 w-6"
                              src={getTeamLogo(game?.HOME_TEAM_NAME?.abbreviation)}
                            />
                          </div>
                          {game?.HOME_TEAM_NAME?.nickname} 
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col items-start text-gray-400" >
                          <p className="text-xs lg:text-normal">{game?.GAME_STATUS_TEXT}</p>
                          <p className="text-xs lg:text-normal">{game?.NATL_TV_BROADCASTER_ABBREVIATION}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 flex ml-4" >—</TableCell>
                      <TableCell className="text-gray-400">{game?.ARENA_NAME}</TableCell>
                      <TableCell className="text-gray-400">{game?.HOME_TV_BROADCASTER_ABBREVIATION}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>

          </div>
      </div>
    </div>
  )
}

export default GameSchedule