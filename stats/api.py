
import json
from typing import Optional, List
from ninja import NinjaAPI
from nba_api.stats.endpoints import leaguegamefinder
from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import scoreboardv2
from nba_api.stats.endpoints import boxscoretraditionalv2
from nba_api.live.nba.endpoints import boxscore
from nba_api.stats.endpoints import fantasywidget
from nba_api.stats.static import teams
from .constants.constants import all_stats_columns, GetTeamsDict, valid_team_stats
from .Enums.stats import Stats
from ninja.errors import HttpError
from datetime import timezone
from dateutil import parser
from .Schema import PlayerSchema, NotFoundSchema
from .Schema.MessageSchema import MessageSchema
from .Models import Player
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from .Models import Player
from .Services import GetPlayerStats, GetPlayerStatsDf
import re
import pandas as pd
from nba_api.stats.endpoints import boxscoretraditionalv2
from ninja import Query

api = NinjaAPI()

@api.get("/playerLeadingStats")
def leadingPlayersGivenStat(request, season: str = "2023-24"):
    try:
        if not re.match(r"\d{4}-\d{2}", season):
            return JsonResponse({'error': 'Invalid season format. It should be YYYY-YY.'}, status=400)
        return GetPlayerStats(season, "PTS")
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api.get("/leadingPlayersForEachStat")
def leadingPlayersForEachStat(request, stat: str = "PTS", season: str = "2023-24"):
    try:
        if not re.match(r"\d{4}-\d{2}", season):
            return JsonResponse({'error': 'Invalid season format. It should be YYYY-YY.'}, status=400)
        
        stats = ["PTS", "REB", "AST", "STL", "BLK", "FG_PCT", "FG3_PCT", "MIN", "TOV"]
        result = []

        for stat in stats:
            result.append({
                'stat': stat,
                'data': GetPlayerStats(season, stat)
            })

        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api.get("/{team}/{stat}")
def leadingStatsByTeam(request, team: str, stat: str):
    try:
        team = team.lower()
        if stat.upper() not in all_stats_columns:
            raise HttpError(400, "Invalid stat parameter provided.")
        
        team_dict = GetTeamsDict()
        matching_team = None
        matching_key = None
        if team in team_dict:
            matching_team = team_dict[team]
            matching_key = team
        else:
            for key, value in team_dict.items():
                if team in [value['full_name'], value['nickname']]:
                    matching_team = value
                    matching_key = key
                    break
        
        if not matching_key:
            raise HttpError(400, "Invalid team parameter provided.")
        ## Should add the season parameter here instead of hard coding
        df = GetPlayerStatsDf("2023-24")
        df_team = df[df['TEAM_ABBREVIATION'] == matching_key.upper()]
        df_team = df_team.sort_values(by=[stat], ascending=False)
        print(df_team)
        return df_team.to_json(orient='records')
            
    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")

@api.get("/teamSchedule")
def GetGameResultsByTeam(request, team: str, season: Optional[str] = None):
    try:
        team = team.lower()
        team_dict = GetTeamsDict()
        matching_team = None
        matching_key = None
        if team in team_dict:
            matching_team = team_dict[team]
            matching_key = team
        else:
            for key, value in team_dict.items():
                if team in [value['full_name'], value['nickname']]:
                    matching_team = value
                    matching_key = key
                    break
        
        if not matching_key:
            raise HttpError(400, "Invalid team parameter provided.")
       
        print("matching key: ", matching_key)
        gamefinder = leaguegamefinder.LeagueGameFinder(team_id_nullable=matching_team['id'])
        games = gamefinder.get_data_frames()[0]
        games = games[games.SEASON_ID.str[-4:] == "2023"]
        return games.to_json(orient='records')
        
    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")

@api.get("/todaysGames")
def GetTodaysGames(request): 
    try:
        f = "{gameId}: {awayTeam} vs. {homeTeam} @ {gameTimeLTZ}" 

        board = scoreboard.ScoreBoard()
        if not board: 
            return json.dumps([])

        if not board.score_board_date:
            print("Invalid score board date.")
            raise HttpError(400, "Invalid score board date.")
        print("ScoreBoardDate: " + board.score_board_date)

        games = board.games.get_dict()
        if not games: 
            return json.dumps([])

        todaysGames = []
        for game in games:
            if not all(key in game for key in ("gameId", "awayTeam", "homeTeam", "gameTimeUTC")):
                print("Invalid game data.")
                raise HttpError(400, "Invalid game data.")
            try:
                gameTimeLTZ = parser.parse(game["gameTimeUTC"]).replace(tzinfo=timezone.utc).astimezone(tz=None)
            except ValueError:
                print("Invalid game time.")
                raise HttpError(400, "Invalid game time.")
            game_info = f.format(gameId=game['gameId'], awayTeam=game['awayTeam']['teamName'], homeTeam=game['homeTeam']['teamName'], gameTimeLTZ=gameTimeLTZ)
            todaysGames.append(game_info)

    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")
    
    return json.dumps(todaysGames)

@api.get("/game")
def GetGameBoxScore(request, gameId: int):
    try:
        gameId = str(gameId)
        gameId = str(gameId).zfill(10)  # Pad the gameId with leading zeros if necessary
        if not gameId.isdigit():
            print("Invalid gameId provided. gameId should be numeric.", gameId)
            raise HttpError(400, "Invalid gameId provided. gameId should be numeric.")
        if len(gameId) < 10:
            print("Invalid gameId provided. gameId should be at least 10 characters long.", gameId)
            raise HttpError(400, "Invalid gameId provided. gameId should be at least 10 characters long.", gameId)
        if int(gameId) <= 0:
            print("Invalid gameId provided. gameId should be positive.")
            raise HttpError(400, "Invalid gameId provided. gameId should be positive.")

        box = boxscore.BoxScore(gameId)
        box = box.game.get_dict()
        if not box:
            print("No box score data found for the provided gameId.")
            raise HttpError(404, "No box score data found for the provided gameId.")

    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")
    return json.dumps(box)

@api.get("/teamLeadingStats")
def GetLeadingTeamStats(request, stat: str = "PTS", season: str = "2023-24"):
    try: 
        # Check if stat is valid
        if stat not in valid_team_stats:
            return JsonResponse({'error': 'Invalid stat. It should be one of ' + ', '.join(valid_team_stats) + '.'}, status=400)

        # Check if season is valid
        if not re.match(r"\d{4}-\d{2}", season):
            return JsonResponse({'error': 'Invalid season format. It should be YYYY-YY.'}, status=400)
        if int(season.split("-")[0]) < 1946 or int(season.split("-")[0]) > datetime.now().year:
            return JsonResponse({'error': 'Invalid season. It should be between 1946-47 and this year.'}, status=400)
        
        nba_teams = teams.get_teams()
        gamefinder = leaguegamefinder.LeagueGameFinder()
        games = gamefinder.get_data_frames()[0]  # Moved outside the loop
        team_stats_list = []
        # Loop through all teams and get their game logs
        for team in nba_teams:
            team_id = team['id']
            team_name = team['full_name']
            
            season_id = "2" + season.split("-")[0]  # replace with the season id you want to filter by
            filtered_games = games.loc[(games['SEASON_ID'] == season_id) & (games['TEAM_ID'] == team_id)]
            team_total_pts = int(filtered_games[stat].sum())
            team_total_stats = {
                "TEAM_ID": team_id,
                "TEAM_NAME": team_name,
                "TEAM_ABBREVIATION": team['abbreviation'],
                "PTS": team_total_pts,
                "STL": int(filtered_games['STL'].sum()),
                "BLK": int(filtered_games['BLK'].sum()),
                "REB": int(filtered_games['REB'].sum()),
                "AST": int(filtered_games['AST'].sum()),
                "FGM": int(filtered_games['FGM'].sum()),
                "FGA": int(filtered_games['FGA'].sum()),
                "FG3M": int(filtered_games['FG3M'].sum()),
                "FG3A": int(filtered_games['FG3A'].sum()),
                "FTM": int(filtered_games['FTM'].sum()),
                "FTA": int(filtered_games['FTA'].sum()),
                "TOV": int(filtered_games['TOV'].sum()),
                "GP": len(filtered_games),
                "PPG": team_total_pts / len(filtered_games)
            }
            team_stats_list.append(team_total_stats)
            
        team_stats_list = sorted(team_stats_list, key=lambda k: k[stat], reverse=True)
        return JsonResponse(team_stats_list, safe=False)
    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")
    
@api.get("/leadingTeamsForEachStat")
def leadingTeamsForEachStat(request, season: str = "2023-24"):
    try:
        if not re.match(r"\d{4}-\d{2}", season):
            return JsonResponse({'error': 'Invalid season format. It should be YYYY-YY.'}, status=400)
        
        nba_teams = teams.get_teams()
        gamefinder = leaguegamefinder.LeagueGameFinder()
        games = gamefinder.get_data_frames()[0]  # Moved outside the loop
        result = []

        for stat in valid_team_stats:
            team_stats_list = []
            # Loop through all teams and get their game logs
            for team in nba_teams:
                team_id = team['id']
                team_name = team['full_name']
                
                season_id = "2" + season.split("-")[0]  # replace with the season id you want to filter by
                filtered_games = games.loc[(games['SEASON_ID'] == season_id) & (games['TEAM_ID'] == team_id)]
                team_total_stats = {
                    "TEAM_ID": team_id,
                    "TEAM_NAME": team_name,
                    "TEAM_ABBREVIATION": team['abbreviation'],
                    "PTS": int(filtered_games['PTS'].sum()),
                    "STL": int(filtered_games['STL'].sum()),
                    "BLK": int(filtered_games['BLK'].sum()),
                    "REB": int(filtered_games['REB'].sum()),
                    "AST": int(filtered_games['AST'].sum()),
                    "FGM": int(filtered_games['FGM'].sum()),
                    "FGA": int(filtered_games['FGA'].sum()),
                    "FG3M": int(filtered_games['FG3M'].sum()),
                    "FG3A": int(filtered_games['FG3A'].sum()),
                    "FTM": int(filtered_games['FTM'].sum()),
                    "FTA": int(filtered_games['FTA'].sum()),
                    "TOV": int(filtered_games['TOV'].sum()),
                    "GP": len(filtered_games),
                    "PPG": int(filtered_games['PTS'].sum()) / len(filtered_games) if len(filtered_games) > 0 else 0
                }
                team_stats_list.append(team_total_stats)
                
            team_stats_list = sorted(team_stats_list, key=lambda k: k[stat], reverse=True)
            result.append({
                'stat': stat,
                'data': team_stats_list
            })

        return JsonResponse(result, safe=False)
    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")

@api.get("/fantasyStats")
def GetFantasyStats(request):
    # add a stat param, have it set to default, if the stat is default just return the list of all players fantasy
    # stats in no particular order, if the stat is not default, sort the list of players by that stat
    try:
        fw = fantasywidget.FantasyWidget()

        # Get the data
        data_frames = fw.get_data_frames()

        # data_frames is a list of pandas DataFrames. You can access individual DataFrames like this:
        df0 = data_frames[0]
        return df0.to_json(orient='records')
    
    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")
    

# Index(['GAME_DATE_EST', 'GAME_SEQUENCE', 'GAME_ID', 'GAME_STATUS_ID',
#        'GAME_STATUS_TEXT', 'GAMECODE', 'HOME_TEAM_ID', 'VISITOR_TEAM_ID',
#        'SEASON', 'LIVE_PERIOD', 'LIVE_PC_TIME',
#        'NATL_TV_BROADCASTER_ABBREVIATION', 'HOME_TV_BROADCASTER_ABBREVIATION',
#        'AWAY_TV_BROADCASTER_ABBREVIATION', 'LIVE_PERIOD_TIME_BCAST',
#        'ARENA_NAME', 'WH_STATUS', 'WNBA_COMMISSIONER_FLAG'],
#       dtype='object')

@api.get("/boxScore")
def GetBoxScore(request, gameId: str): 
    try:
        # Use the BoxScoreTraditionalV2 endpoint to get game details
        box_score = boxscoretraditionalv2.BoxScoreTraditionalV2(game_id=gameId)
        game_detail = box_score.get_data_frames()[0]
        print(game_detail)

        # Return the game details
        return game_detail.to_json(orient='records')

    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"Invalid Query Parameter Passed.")

@api.get("/schedule")
def GetNBASchedule(request, date: Optional[str] = None): 
    try:
        if(date is None):
            # Specify the date you are interested in (YYYY, MM, DD)
            date = datetime(2023, 12, 11)
        else:
            date = datetime.strptime(date, '%Y-%m-%d')  
            print("date: ", date)

        # Use the Scoreboard endpoint to get the games for the specified date
        sb = scoreboardv2.ScoreboardV2(day_offset='0', game_date=date)

        # The game_header data frame contains the basic information about each game
        games = sb.game_header.get_data_frame()

        games['HOME_TEAM_NAME'] = games['HOME_TEAM_ID'].apply(lambda team_id: teams.find_team_name_by_id(team_id))
        games['VISITOR_TEAM_NAME'] = games['VISITOR_TEAM_ID'].apply(lambda team_id: teams.find_team_name_by_id(team_id))
        
        with pd.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
            print(games) 
        return games.to_json(orient='records')

    except Exception as e:
        print("An error occurred:", e)
        raise HttpError(500,"An error occurred.")

@api.post("/watchlist", response={201: PlayerSchema})
def AddPlayerToWishlist(request, player: PlayerSchema):
    try:
        # Create a new Player instance and save it to the database
        Player.objects.create(
            username=player.username,
            first_name=player.first_name,
            last_name=player.last_name,
            team=player.team,
            player_id=player.player_id
        )

        # Return a success response
        return JsonResponse({'message': 'Player added to wishlist successfully.'}, status=201)

    except Exception as e:
        # If something goes wrong, return an error response
        return JsonResponse({'error': str(e)}, status=400)

@api.get("/watchlist", response={200: List[PlayerSchema], 201: MessageSchema, 404: NotFoundSchema})
def GetWishList(request, username: str):
    try:
        watchlist = Player.objects.filter(username=username)
        if not watchlist:
            return 201, {"message": 'No Players in wishlist.'}
        
        return 200, watchlist
    except Exception as e:
        return 404, {"message": str(e)}

@api.delete("/watchlist")
def DeletePlayerFromWishlist(request, player_id: int, username: str): 
    try: 
        player = Player.objects.get(player_id=player_id, username=username)
        player.delete()
        return JsonResponse({'message': 'Player deleted from wishlist successfully.'}, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Player not found in wishlist.'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

## TODO: Need to add routes for all-time leaders for each stat not just for a particular season
