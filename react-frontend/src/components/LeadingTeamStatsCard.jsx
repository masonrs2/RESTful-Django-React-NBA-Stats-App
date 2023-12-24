import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamLogos, getTeamLogo } from "../assets/constants/TeamLogos";
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { setPlayerDataStore, setPlayerDataError } from "../redux/playerDataSlice";

const LeadingTeamStatsCard = ({ stat, isLoading, teamData }) => {
    // const [teamData, setTeamData] = useState([]);
    // const dispatch = useDispatch();

    // const fetchData = (statType) => {
    //     if (statType == "PPG") statType = "PTS"
    //   setIsLoading(true);
    //   fetch(`http://127.0.0.1:8000/api/teamLeadingStats?stat=${statType}`)
    //     .then(response => {
    //       if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //       }
    //       return response.json();
    //     })
    //     .then(fetchedData => {
    //         console.log("fetchedData: ", fetchedData)
          
    //       setTeamData(fetchedData);
    //       // dispatch(setPlayerDataStore(parsedData));
    //     })
    //     .catch(error => {
    //       console.log('Fetch error:', error);
    //       // dispatch(setPlayerDataError(error.message));
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // }
  
    useEffect(() => {
        // fetchData(stat.Abbreviation); 
        console.log("TEAM DATA: ", teamData) 
        console.log("STAT: ", stat.Abbreviation)
    }, []);
  
  return (
    isLoading ? (<div>Loading...</div>) :
    <div className="flex flex-col text-zinc-400 font-medium bg-zinc-900 outline outline-[.5px] outline-gray-500 m-4">
      <h1 className="p-3 px-5 flex outline outline-[.5px] outline-gray-500">{stat?.Stat} Per Game</h1>
      <div className="outline outline-gray-500 outline-[.5px]">
        <Table className="">  
            <TableBody>
                <TableRow className="cursor-pointer hover:bg-zinc-800">
                <TableCell>
                    <p className="text-2xl font-semibold">1</p>
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center gap-1">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center">
                          <img className="object-cover" src={getTeamLogo(teamData[0]?.TEAM_ABBREVIATION)} alt={teamData[0]?.TEAM_ABBREVIATION} />
                        </div>
                        <div className="rounded-full overflow-hidden flex items-center">
                        </div>
                    </div>
                    </TableCell>
                <TableCell>
                    <div className="flex flex-col px-2">
                    <p className="text-lg">{teamData[0]?.TEAM_NAME}</p>
                    <p className="font-light">{teamData[0]?.TEAM_ABBREVIATION} • ({teamData[0]?.TEAM_ID})</p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col px-2 text-2xl items-center text-right">
                    {teamData.length > 0 && teamData[0][stat.Abbreviation] && 
                        <p className="text-right w-full">
                        {stat.Abbreviation === 'PPG' ? teamData[0][stat.Abbreviation]?.toFixed(1) : (teamData[0][stat.Abbreviation] / teamData[0]["GP"])?.toFixed(1)}
                        </p>
                    }
                    <p className="font-light text-xs text-right w-full">{stat?.Abbreviation.slice(0,1)}PG</p>
                    </div>
                </TableCell>
                </TableRow>
            </TableBody>
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow className=" border-b-[.5px] border-zinc-700  hover:bg-zinc-800/60">
              <TableHead>Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>{stat?.Abbreviation.slice(0,1)}PG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              Array.isArray(teamData) &&  teamData.slice(1,6).map((player, index) => (
                <TableRow className="cursor-pointer border-t-[.5px] border-zinc-700 hover:bg-zinc-800/60" key={index+1}>
                    <TableCell className="font-semibold">{index+2}</TableCell>
                    <TableCell className="flex gap-4 items-center ">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center">
                            <img className="object-cover" src={getTeamLogo(player?.TEAM_ABBREVIATION)} alt={player?.TEAM_ABBREVIATION} />
                        </div>{player?.TEAM_NAME}
                    </TableCell>
                    <TableCell className="font-light ">
                        {stat.Abbreviation === "PPG" 
                            ? player[stat.Abbreviation]?.toFixed(1) 
                            : (player[stat.Abbreviation] / player?.GP)?.toFixed(1)
                        }
                    </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>

        <div className="w-full flex items-center justify-center py-5 text-sm font-light tracking-wide border-t-[.5px] border-zinc-700 ">
          {
            !isLoading && teamData.length > 0 && (
              <Link to={{
                pathname: `/nba/stats/teams/${stat.Abbreviation}`,
               
              }}>
                  <a className="hover:underline  hover:underline-offset-1  cursor-pointer hover:scale-105 hover:duration-200 hover:text-blue-500 active:text-blue-400 ">Complete {stat.Stat} Per Game</a>
              </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadingTeamStatsCard;