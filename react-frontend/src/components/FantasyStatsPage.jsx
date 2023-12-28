import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FantasyStatsTypes } from '../assets/constants/StatTypes';

const FantasyStatsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [fantasyStatsData, setFantasyStatsData] = useState([]) 
  const GetScheduleByDate = () => {
    try {
      if(true) {
        setIsLoading(true)
        fetch(`https://nba-stats-backend-production.up.railway.app/api/fantasyStats`)
          .then(res => res.json())
          .then(data => {
            console.log("data: ", JSON.parse(data))
            setFantasyStatsData(JSON.parse(data))
          })
          .catch(err => console.log(err))
          .finally(() => setIsLoading(false))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    GetScheduleByDate()
  }, [])

  return (
    <div className="h-full w-screen">
      <div className="flex flex-col py-20 px-16 md:px-20 lg:px-24 xl:px-40 2xl:px-80 ">
        <div className="relative">
        </div>

          <div className="flex flex-col mt-6 bg-zinc-900 outline outline-[.5px] outline-gray-500 " > 
            <div className="mt-2">
              <h1 className="text-gray-400 mt-2 ml-4 text-xl font-medium" >NBA Fantasy Stats</h1>
            </div>

            <Table>
              <TableHeader>
                <TableRow className=" border-b-[.5px] border-zinc-700  hover:bg-zinc-800/60">
                  {
                    FantasyStatsTypes.map((stat, index) => (
                      <TableHead key={index}>{stat.Name}</TableHead>
                    ))
                  }
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {
                  fantasyStatsData.map((player, index) => (
                    <TableRow key={index} className=" text-gray-400 outline outline-[.5px] outline-gray-500 cursor-pointer hover:bg-zinc-800">
                      {
                        FantasyStatsTypes.map((statType, idx) => (
                          idx === 0 ? (<div>
                            <TableCell key={idx} className="flex-1">
                              <p className="flex gap-4 items-center font-medium w-[230px]">
                                {player?.PLAYER_NAME} 
                                <div className="flex flex-row gap-1 font-light text-sm  text-zinc-300">
                                 {player?.TEAM_ABBREVIATION}
                                </div>
                              </p>
                            </TableCell>
                          </div>) : (
                          <TableCell key={idx} className="">
                            {statType.isDecimal ? (player[statType.Stat] ? player[statType.Stat].toFixed(1) : '') : player[statType.Stat] || 'n/a'}
                          </TableCell>
                        )))
                      }
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

export default FantasyStatsPage