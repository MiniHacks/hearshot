import requests
from pydantic import BaseModel
from fastapi import FastAPI

from os import environ

app = FastAPI()


class Location(BaseModel):
    address: str
    raw_address: str | None
    name: str
    latitude: float
    longitude: float


@app.get("/")
async def root():
    return {"message": "Hello World"}


def convert_to_lat_long(
    address_query: str,
    static_longitude: float = -118.2518,
    static_latitude: float = 34.0488,
) -> Location | None:
    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    params = {
        "input": address_query,  # example: "13702 Hoover Street",
        "fields": "formatted_address,name,geometry",
        "inputtype": "textquery",
        "locationbias": f"circle:50000@{static_latitude},{static_longitude}",
        "key": environ["MAPS_API_KEY"],
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        candidate = data["candidates"][0]
        return Location(
            address=candidate["formatted_address"],
            raw_address=address_query,
            name=candidate["name"],
            latitude=candidate["geometry"]["location"]["lat"],
            longitude=candidate["geometry"]["location"]["lng"],
        )
    else:
        print(f"Error: {response.status_code}")
