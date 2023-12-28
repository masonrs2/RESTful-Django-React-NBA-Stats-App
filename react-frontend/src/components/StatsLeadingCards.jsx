import { useEffect, useState } from "react";
import { LeadingStats } from "../assets/constants/StatTypes";
import StatCard from "./StatCard";


export const StatsLeadingCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allPlayerStatsData, setAllPlayerStatsData] = useState();
  const fetchAllPlayerLeadingStatsData = () => {
    setIsLoading(true);
    try {
      fetch('https://nba-stats-backend-production.up.railway.app/api/leadingPlayersForEachStat')
        .then(response => {
          if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(fetchedData => {
          try {
            setAllPlayerStatsData(fetchedData);

            console.log("All Player Stats Data11", fetchedData)
          } catch (error) {
            console.error('Parsing error:', error);
          }
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error('Parsing error:', error);
    }
  }

  useEffect(() => {
    fetchAllPlayerLeadingStatsData();
    if(allPlayerStatsData) {
      console.log("All Player Stats Data NAME", allPlayerStatsData[0]?.data);
      console.log("All Player Stats Data STAT", allPlayerStatsData[0]?.stat);
    }
  }, []);

  return (
    <div className="w-screen h-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 pt-8 px-16 md:px-20 lg:px-24 xl:px-32 2xl:px-48">
        {
          allPlayerStatsData ? LeadingStats.map((stat, index) => (
            <StatCard key={index} stat={stat} playerData={allPlayerStatsData[index]?.data} />
          ))
          : <h1>Loading...</h1>
        } 
    </div>
  )
}
