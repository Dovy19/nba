export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  conference: "East" | "West";
  division: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const NBA_TEAMS: Team[] = [
  // Eastern Conference - Atlantic
  { id: 1, name: "Boston Celtics", abbreviation: "BOS", conference: "East", division: "Atlantic", colors: { primary: "#007A33", secondary: "#BA9653" } },
  { id: 2, name: "Brooklyn Nets", abbreviation: "BKN", conference: "East", division: "Atlantic", colors: { primary: "#000000", secondary: "#FFFFFF" } },
  { id: 3, name: "New York Knicks", abbreviation: "NYK", conference: "East", division: "Atlantic", colors: { primary: "#006BB6", secondary: "#F58426" } },
  { id: 4, name: "Philadelphia 76ers", abbreviation: "PHI", conference: "East", division: "Atlantic", colors: { primary: "#006BB6", secondary: "#ED174C" } },
  { id: 5, name: "Toronto Raptors", abbreviation: "TOR", conference: "East", division: "Atlantic", colors: { primary: "#CE1141", secondary: "#000000" } },
  
  // Eastern Conference - Central
  { id: 6, name: "Chicago Bulls", abbreviation: "CHI", conference: "East", division: "Central", colors: { primary: "#CE1141", secondary: "#000000" } },
  { id: 7, name: "Cleveland Cavaliers", abbreviation: "CLE", conference: "East", division: "Central", colors: { primary: "#860038", secondary: "#FDBB30" } },
  { id: 8, name: "Detroit Pistons", abbreviation: "DET", conference: "East", division: "Central", colors: { primary: "#C8102E", secondary: "#1D42BA" } },
  { id: 9, name: "Indiana Pacers", abbreviation: "IND", conference: "East", division: "Central", colors: { primary: "#002D62", secondary: "#FDBB30" } },
  { id: 10, name: "Milwaukee Bucks", abbreviation: "MIL", conference: "East", division: "Central", colors: { primary: "#00471B", secondary: "#EEE1C6" } },
  
  // Eastern Conference - Southeast
  { id: 11, name: "Atlanta Hawks", abbreviation: "ATL", conference: "East", division: "Southeast", colors: { primary: "#E03A3E", secondary: "#C1D32F" } },
  { id: 12, name: "Charlotte Hornets", abbreviation: "CHA", conference: "East", division: "Southeast", colors: { primary: "#1D1160", secondary: "#00788C" } },
  { id: 13, name: "Miami Heat", abbreviation: "MIA", conference: "East", division: "Southeast", colors: { primary: "#98002E", secondary: "#F9A01B" } },
  { id: 14, name: "Orlando Magic", abbreviation: "ORL", conference: "East", division: "Southeast", colors: { primary: "#0077C0", secondary: "#C4CED4" } },
  { id: 15, name: "Washington Wizards", abbreviation: "WAS", conference: "East", division: "Southeast", colors: { primary: "#002B5C", secondary: "#E31837" } },
  
  // Western Conference - Northwest
  { id: 16, name: "Denver Nuggets", abbreviation: "DEN", conference: "West", division: "Northwest", colors: { primary: "#0E2240", secondary: "#FEC524" } },
  { id: 17, name: "Minnesota Timberwolves", abbreviation: "MIN", conference: "West", division: "Northwest", colors: { primary: "#0C2340", secondary: "#236192" } },
  { id: 18, name: "Oklahoma City Thunder", abbreviation: "OKC", conference: "West", division: "Northwest", colors: { primary: "#007AC1", secondary: "#EF3B24" } },
  { id: 19, name: "Portland Trail Blazers", abbreviation: "POR", conference: "West", division: "Northwest", colors: { primary: "#E03A3E", secondary: "#000000" } },
  { id: 20, name: "Utah Jazz", abbreviation: "UTA", conference: "West", division: "Northwest", colors: { primary: "#002B5C", secondary: "#00471B" } },
  
  // Western Conference - Pacific
  { id: 21, name: "Golden State Warriors", abbreviation: "GSW", conference: "West", division: "Pacific", colors: { primary: "#1D428A", secondary: "#FFC72C" } },
  { id: 22, name: "Los Angeles Clippers", abbreviation: "LAC", conference: "West", division: "Pacific", colors: { primary: "#C8102E", secondary: "#1D428A" } },
  { id: 23, name: "Los Angeles Lakers", abbreviation: "LAL", conference: "West", division: "Pacific", colors: { primary: "#552583", secondary: "#FDB927" } },
  { id: 24, name: "Phoenix Suns", abbreviation: "PHX", conference: "West", division: "Pacific", colors: { primary: "#1D1160", secondary: "#E56020" } },
  { id: 25, name: "Sacramento Kings", abbreviation: "SAC", conference: "West", division: "Pacific", colors: { primary: "#5A2D81", secondary: "#63727A" } },
  
  // Western Conference - Southwest
  { id: 26, name: "Dallas Mavericks", abbreviation: "DAL", conference: "West", division: "Southwest", colors: { primary: "#00538C", secondary: "#002F5B" } },
  { id: 27, name: "Houston Rockets", abbreviation: "HOU", conference: "West", division: "Southwest", colors: { primary: "#CE1141", secondary: "#000000" } },
  { id: 28, name: "Memphis Grizzlies", abbreviation: "MEM", conference: "West", division: "Southwest", colors: { primary: "#5D76A9", secondary: "#12173F" } },
  { id: 29, name: "New Orleans Pelicans", abbreviation: "NOP", conference: "West", division: "Southwest", colors: { primary: "#0C2340", secondary: "#C8102E" } },
  { id: 30, name: "San Antonio Spurs", abbreviation: "SAS", conference: "West", division: "Southwest", colors: { primary: "#C4CED4", secondary: "#000000" } },
];

// Helper functions
export const EASTERN_TEAMS = NBA_TEAMS.filter(t => t.conference === "East").sort((a, b) => a.name.localeCompare(b.name));
export const WESTERN_TEAMS = NBA_TEAMS.filter(t => t.conference === "West").sort((a, b) => a.name.localeCompare(b.name));

export function getTeamById(id: number): Team | undefined {
  return NBA_TEAMS.find(team => team.id === id);
}

export function getTeamsByConference(conference: "East" | "West"): Team[] {
  return NBA_TEAMS.filter(team => team.conference === conference).sort((a, b) => a.name.localeCompare(b.name));
}
