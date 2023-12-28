import React, { useEffect, useState } from 'react'
import { CompleteLeadingTeamStats, LeadingTeamStats } from '../assets/constants/StatTypes'
import LeadingTeamStatsCard from './LeadingTeamStatsCard'

const TeamLeadersTableCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allTeamStatsData, setAllTeamStatsData] = useState();

  const fetchAllTeamLeadingStatsData = () => {
    setIsLoading(true);
    try {
      fetch('https://nba-stats-backend-production.up.railway.app/api/leadingTeamsForEachStat')
        .then(response => {
          if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(fetchedData => {
          try {
            setAllTeamStatsData(fetchedData);

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
    fetchAllTeamLeadingStatsData();
    if(allTeamStatsData) {
      console.log("All TEAM Stats Data NAME", allTeamStatsData[0]?.data);
      
    }
  }, []);
  return (
    <div className="w-screen h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-8 px-12">
      {
        allTeamStatsData ? LeadingTeamStats.map((stat, index) => (
          <LeadingTeamStatsCard key={index} stat={stat} isLoading={isLoading} teamData={allTeamStatsData[index]?.data} />
        ))
        : <h1>Loading...</h1>
      }
    </div>
  )
}

export default TeamLeadersTableCards