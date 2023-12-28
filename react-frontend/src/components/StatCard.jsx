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
import { TfiUser } from "react-icons/tfi"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { setPlayerDataStore, setPlayerDataError } from "../redux/playerDataSlice";

const StatCard = ({ stat, playerData }) => {
    // const [playerData, setPlayerData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const dispatch = useDispatch();

    const fetchData = (stat) => {
      setIsLoading(true);
      fetch(`https://nba-stats-backend-production.up.railway.app/api/playerLeadingStats?stat=${stat}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(fetchedData => {
          try {
            const parsedData = JSON.parse(fetchedData);
            setPlayerData(parsedData);
            // dispatch(setPlayerDataStore(parsedData));
          } catch (error) {
            console.error('Parsing error:', error);
            // dispatch(setPlayerDataError(error.message));
          }
        })
        .catch(error => {
          console.log('Fetch error:', error);
          // dispatch(setPlayerDataError(error.message));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    useEffect(() => {
        // fetchData(stat.Abbreviation);  
        console.log("Playerssss Data", playerData);
    }, []);
  
    useEffect(() => {
      if (playerData.length > 0) {
        console.log("Player 0", playerData[0]?.PLAYER_NAME);
        console.log("Player 1", playerData[1]);
        console.log("STATTTTT: ", stat)
      }
    }, [playerData])

  return (
    <div className="flex flex-col text-zinc-400 font-medium bg-zinc-900 outline outline-[.5px] outline-gray-500 my-4 mr-4 lg:mr-6 xl:mr-8 mb-4 ">
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
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center">
                        <img className="object-cover" src={getTeamLogo(playerData[0]?.TEAM_ABBREVIATION)} alt={playerData[0]?.TEAM_ABBREVIATION} />
                        </div>
                        <div className="rounded-full overflow-hidden flex items-center">
                          <TfiUser height={20} width={20} className="object-cover h-9 w-9" src={getTeamLogo(playerData[0]?.TEAM_ABBREVIATION)} alt={playerData[0]?.TEAM_ABBREVIATION} />
                        </div>
                    </div>
                    </TableCell>
                <TableCell>
                    <div className="flex flex-col px-2">
                    <p className="text-lg">{playerData[0]?.PLAYER_NAME}</p>
                    <p className="font-light">{playerData[0]?.TEAM_ABBREVIATION} • ({playerData[0]?.AGE})</p>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex flex-col px-2 text-2xl items-center text-right">
                    {playerData.length > 0 && playerData[0][stat.Abbreviation] && 
                        <p className="text-right w-full">
                        {stat.Abbreviation === 'PPG' ? playerData[0][stat.Abbreviation].toFixed(1) : (playerData[0][stat.Abbreviation] / playerData[0]["GP"]).toFixed(1)}
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
              <TableHead>Player</TableHead>
              <TableHead>{stat?.Abbreviation?.slice(0,1)}PG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              Array.isArray(playerData) &&  playerData?.slice(1,6)?.map((player, index) => (
                <TableRow className="cursor-pointer border-t-[.5px] border-zinc-700 hover:bg-zinc-800/60" key={index+1}>
                    <TableCell className="font-semibold">{index+2}</TableCell>
                    <TableCell className="flex gap-4 items-center ">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center">
                            <img className="object-cover" src={getTeamLogo(player?.TEAM_ABBREVIATION)} alt={player?.TEAM_ABBREVIATION} />
                        </div>{player?.TEAM_ABBREVIATION}
                    </TableCell>
                    <TableCell>{player?.PLAYER_NAME}</TableCell>
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
            playerData?.length > 0 && (
              <Link to={{
                pathname: `/nba/stats/players/${stat?.Abbreviation}`,
               
              }}>
                  <span className="hover:underline  hover:underline-offset-1  cursor-pointer hover:scale-105 hover:duration-200 hover:text-blue-500 active:text-blue-400 ">Complete {stat.Stat} Per Game</span>
              </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;