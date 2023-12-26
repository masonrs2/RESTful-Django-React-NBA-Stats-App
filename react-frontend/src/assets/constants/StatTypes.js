export const AllStatTypes = [
  "PLAYER_ID",
  "PLAYER_NAME",
  "NICKNAME",
  "TEAM_ID",
  "TEAM_ABBREVIATION",
  "AGE",
  "GP",
  "W",
  "L",
  "W_PCT",
  "MIN",
  "FGM",
  "FGA",
  "FG_PCT",
  "FG3M",
  "FG3A",
  "FG3_PCT",
  "FTM",
  "FTA",
  "FT_PCT",
  "OREB",
  "DREB",
  "REB",
  "AST",
  "TOV",
  "STL",
  "BLK",
  "BLKA",
  "PF",
  "PFD",
  "PTS",
  "PLUS_MINUS",
  "NBA_FANTASY_PTS",
  "PLUS_MINUS_RANK",
  "NBA_FANTASY_PTS_RANK",
  "PPG",
];

export const LeadingStats = [
  { Abbreviation: "PPG", Stat: "Points" },
  { Abbreviation: "REB", Stat: "Rebounds" },
  { Abbreviation: "AST", Stat: "Assists" },
  { Abbreviation: "STL", Stat: "Steals" },
  { Abbreviation: "BLK", Stat: "Blocks" },
  { Abbreviation: "FG_PCT", Stat: "Field Goal %" },
  { Abbreviation: "FG3_PCT", Stat: "3-Point %" },
  { Abbreviation: "MIN", Stat: "Minutes" },
  { Abbreviation: "TOV", Stat: "Turnovers" },
];

export const LeadingTeamStats = [
  { Abbreviation: "PPG", Stat: "Points" },
  { Abbreviation: "FG3M", Stat: "3 Points Made" },
  { Abbreviation: "TOV", Stat: "Turnovers" },
  { Abbreviation: "REB", Stat: "Rebounds" },
  { Abbreviation: "AST", Stat: "Assists" },
  { Abbreviation: "STL", Stat: "Steals" },
  { Abbreviation: "BLK", Stat: "Blocks" },
  { Abbreviation: "FGM", Stat: "Field Goal Made" },
  { Abbreviation: "FTM", Stat: "Free Throws Made" },

];
export const CompleteLeadingTeamStats = [
  { Abbreviation: "Team Name", Stat: "Team Name" },
  { Abbreviation: "PPG", Stat: "Points" },
  { Abbreviation: "REB", Stat: "Rebounds" },
  { Abbreviation: "BLK", Stat: "Blocks" },
  { Abbreviation: "STL", Stat: "Steals" },
  { Abbreviation: "TOV", Stat: "Turnovers" },
  { Abbreviation: "AST" , Stat: "Assists"},
  { Abbreviation: "FG3A", Stat: "3 Points Attempted" },
  { Abbreviation: "FG3M", Stat: "3 Points Made" },
  { Abbreviation: "FTA", Stat: "Free Throws Attempted" },
  { Abbreviation: "FTM", Stat: "Free Throws Made" },
  { Abbreviation: "FGA", Stat: "Field Goals Attempted" },
  { Abbreviation: "FGM", Stat: "Field Goals Made" },
  { Abbreviation: "TOV", Stat: "Turnovers" },
  { Abbreviation: "GP", Stat: "Games Played" },
];

export const CompleteStatTypes = [
  { Stat: "PLAYER_NAME", IsDecimal: false },
  { Stat: "AGE", IsDecimal: false },
  { Stat: "GP", IsDecimal: false },
  { Stat: "PPG", IsDecimal: true },
  { Stat: "REB", IsDecimal: false },
  { Stat: "AST", IsDecimal: false },
  { Stat: "STL", IsDecimal: false },
  { Stat: "BLK", IsDecimal: false },
  { Stat: "FG3A", IsDecimal: false },
  { Stat: "FG3M", IsDecimal: false },
  { Stat: "FG3_PCT", IsDecimal: true },
  { Stat: "TOV", IsDecimal: false },
  { Stat: "MIN", IsDecimal: true },
]

export const FantasyStatsTypes = [
  { Stat: "PLAYER_NAME", Name: "PLAYER NAME", IsDecimal: false },
  { Stat: "GP", IsDecimal: false, Name: "GP", },
  { Stat: "NBA_FANTASY_PTS", Name: "FANTASY PTS", IsDecimal: true },
  { Stat: "FAN_DUEL_PTS", Name: "FANDUEL PTS", IsDecimal: true },
  { Stat: "REB", Name: "REB", IsDecimal: false },
  { Stat: "AST", Name: "AST", IsDecimal: false },
  { Stat: "STL", Name: "STL", IsDecimal: false },
  { Stat: "BLK", Name: "BLK", IsDecimal: false },
  { Stat: "FTA", Name: "FTA", IsDecimal: false },
  { Stat: "FT_PCT", Name: "FT PCT", IsDecimal: true },
  { Stat: "FG3M", Name: "FG3M", IsDecimal: false },
  { Stat: "TOV", Name: "TOV", IsDecimal: false },
  { Stat: "MIN", Name: "MIN", IsDecimal: true },

]

export const GetStatName = (stat) => {
  const statObject = LeadingStats.find((s) => s.Abbreviation === stat);
  return statObject ? statObject.Stat : stat;
}