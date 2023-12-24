import React, { useState } from 'react'
import { CompleteLeadingTeamStats } from '../assets/constants/StatTypes';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { GetStatName } from '../assets/constants/StatTypes';


const CompleteTeamStatsTable = ({ stat, completeTeamData, endpoint }) => {
    console.log("stat11: ", stat)
    console.log("completePlayerData@@: ", completeTeamData)
    console.log("completePlayerData[0]: ", completeTeamData[0])
  
  return (
    <div className="flex flex-col w-full h-full text-zinc-400 pt-8">
      <div className=" flex w-screen flex-col px-16 md:px-20 lg:px-24 xl:px-32 2xl:px-48 ">
        <div className="bg-zinc-900 outline outline-gray-500 outline-[.5px]">
          <h1 className="p-3 px-5 flex outline outline-[.5px] outline-gray-500">{stat} Per Game</h1>
          <Table className="table-auto bg-zinc-90 outline outline-[.5px] outline-gray-500">
            <TableBody className="">
              <TableRow className="flex outline outline-gray-500 outline-[.5px] hover:bg-zinc-800/60">
                {
                  CompleteLeadingTeamStats.map((tableColumnStat, index) => (
                    index === 0 
                    ? (
                      <TableCell key={index} className="flex-1 w-[260px]"><p className="w-[260px]">{tableColumnStat.Stat}</p></TableCell>
                    )
                    : (
                        <TableCell key={index} className="flex-1">{tableColumnStat.Abbreviation}</TableCell>
                      )
                        
                  ))
                }
                  </TableRow>
                  {completeTeamData.map((team, index) => (
                    <TableRow key={index} className="flex outline outline-gray-500 outline-[.5px] hover:bg-zinc-800/60">
                      {
                        CompleteLeadingTeamStats.map((statType, idx) => (
                          idx === 0 
                          ? (<TableCell key={idx} className="flex-1">
                                <p className="flex gap-4 items-center font-medium w-[230px]">
                                  {team?.TEAM_NAME}
                                  <div className="flex flex-row gap-1 font-light text-xw  text-zinc-300">
                                    ({team?.TEAM_ABBREVIATION})
                                  </div>
                                </p>
                              </TableCell>
                            )
                          : (<TableCell key={idx} className="flex-1">{stat.IsDecimal ? (team[statType.Abbreviation]? team[statType.Abbreviation].toFixed(1) : '') : (statType.Abbreviation == "PPG" ? team[statType.Abbreviation].toFixed(1) : team[statType.Abbreviation]) || 'n/a'}</TableCell>)
                        ))
                      }
                    </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
}

export default CompleteTeamStatsTable