import json
import requests
from config import Config

# Gemini API Endpoint
API_URL = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/gemini-flash-latest:generateContent"
)


def get_ai_recommendations(prompt):
    """
    Sends a prompt to Gemini AI and returns
    a list of recommended movie titles.
    """

    if not prompt or not prompt.strip():
        return {
            "success": False,
            "message": "Prompt cannot be empty."
        }

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": Config.GEMINI_API_KEY
    }

    body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""
You are a movie recommendation engine.

Recommend exactly 5 movies based on the user's request.

Return ONLY valid JSON.

Format:

{{
    "movies": [
        "Movie 1",
        "Movie 2",
        "Movie 3",
        "Movie 4",
        "Movie 5"
    ]
}}

Rules:
- Return ONLY JSON.
- Do not explain anything.
- Do not use markdown.
- Do not add any extra text.
- The movie titles must be accurate.

User Request:
{prompt}
"""
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json=body,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        ai_response = data["candidates"][0]["content"]["parts"][0]["text"]

        try:
            movies = json.loads(ai_response)

            return {
                "success": True,
                "movies": movies["movies"]
            }

        except json.JSONDecodeError:
            return {
                "success": False,
                "message": "Gemini returned an invalid JSON response."
            }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "message": "Gemini request timed out."
        }

    except requests.exceptions.HTTPError:
        try:
            error_message = response.json()["error"]["message"]
        except Exception:
            error_message = "Gemini API returned an unknown error."

        return {
            "success": False,
            "message": error_message
        }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "message": f"Network Error: {str(e)}"
        }

    except (KeyError, IndexError):
        return {
            "success": False,
            "message": "Invalid response received from Gemini."
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Unexpected Error: {str(e)}"
        }