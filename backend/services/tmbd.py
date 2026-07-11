# Fetches trending movies from TMDb.
import requests 
from dotenv import load_dotenv
import os

BASE_URL = "https://api.themoviedb.org/3"


def get_trending_movies():
    load_dotenv()
    api_key = os.getenv("TMDB_API_KEY")
    params = {
        "api_key":api_key 
        
    } 

    url= BASE_URL + "/trending/movie/day"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data


