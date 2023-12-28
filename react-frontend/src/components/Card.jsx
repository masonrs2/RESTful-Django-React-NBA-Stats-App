
import { TableRow, TableCell } from "@/components/ui/table"
import { useEffect, useState } from "react"

export const Card = ({ Player, Index, Stat }) => {
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    fetch('https://nba-stats-backend-production.up.railway.app/api/leadingPoints?season=2012-13')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(fetchedData => {
      setPlayerData(JSON.parse(fetchedData))
    })
    .catch(error => {
      console.log('Fetch error:', error);
    });

  }, []);

  useEffect(() => {
    if (playerData.length > 0) {
      console.log("Player 0", playerData[0].PLAYER_NAME);
      console.log("Player 1", playerData[1]);
    }
  }, [playerData])

  return (
    <TableRow key={index+1}>
        <TableCell>{index+2}</TableCell>
        <TableCell>{player?.TEAM_ABBREVIATION}</TableCell>
        <TableCell>{player?.PLAYER_NAME}</TableCell>
        <TableCell>{player?.PTS}</TableCell>
    </TableRow>
  )
}