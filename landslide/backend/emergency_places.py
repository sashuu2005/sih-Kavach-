import requests
import os

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_places(city):
    geo_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={city}&key={GOOGLE_API_KEY}"
    geo = requests.get(geo_url).json()

    loc = geo["results"][0]["geometry"]["location"]
    lat, lon = loc["lat"], loc["lng"]

    places_url = (
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={lat},{lon}&radius=5000&type=hospital&key={GOOGLE_API_KEY}"
    )

    res = requests.get(places_url).json()

    return [
        {
            "name": p["name"],
            "address": p.get("vicinity", "N/A")
        }
        for p in res.get("results", [])
    ]
