# Fetches trending movies from TMDb.
import requests 
from dotenv import load_dotenv
import os

BASE_URL = "https://api.themoviedb.org/3"
load_dotenv()

def get_trending_movies():
    
    api_key = os.getenv("TMDB_API_KEY")
    params = {
        "api_key":api_key 
        
    } 

    url= BASE_URL + "/trending/movie/day"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

def search_movies(query):
    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key":api_key,
        "query" : query
    } 
    
    url = BASE_URL+ "/search/movie"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

    
def get_movie_details(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    } 

    url = f"{BASE_URL}/movie/{movie_id}"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

def get_movie_trailer(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/{movie_id}/videos"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    trailer_key = None
    trailer_url = None
    for video in data["results"]:
        if (video["type"] == "Trailer" and video["site"] == "YouTube"and video["official"]):
            trailer_key = video["key"]
            trailer_url = f"https://www.youtube.com/watch?v={trailer_key}"
            break 
    
      
    return trailer_url


def get_movie_credits(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/{movie_id}/credits"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    director = None
    cast = [] 
    for person in data["crew"]:
        if person["job"] == "Director":
            director = person["name"]
            break 

    for actor in data["cast"][:5]:
        cast.append(actor["name"])

        
    return {
        "director":director,
        "cast":cast
    }