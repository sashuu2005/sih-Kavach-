import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

from PIL import Image
import io
import math
import sys

try:
    from train_mock_hybrid import MockHybridModel
    hybrid_model = MockHybridModel()
except ImportError:
    print("Could not import MockHybridModel. Please ensure train_mock_hybrid.py exists.")
    sys.exit(1)

def generate_sample_data(city):
    np.random.seed(sum(ord(c) for c in city)) 
    return {
        "rainfall": round(np.random.uniform(0, 100), 2),
        "humidity": round(np.random.uniform(30, 95), 2),
        "river_level": round(np.random.uniform(1.0, 15.0), 2),
        "slope": round(np.random.uniform(0.0, 60.0), 2),
        "vegetation": round(np.random.uniform(0.1, 1.0), 2),
        "past_events": int(np.random.randint(0, 10)),
        "lat": round(np.random.uniform(-90, 90), 4),
        "lon": round(np.random.uniform(-180, 180), 4)
    }

def generate_sample_image():
    return Image.fromarray(np.random.randint(50, 200, (224, 224, 3), dtype=np.uint8))

@app.route("/")
def home():
    return {"message": "Flood & Landslide Prediction API running (Demo Mode - No External APIs)"}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        d = request.json if request.json else request.form
        city = d.get("city", "")
        
        if not city:
            return {"error": "City name is required"}, 400

        data = generate_sample_data(city)
        
        img = generate_sample_image()
        img = img.resize((224, 224))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_batch = np.expand_dims(img_array, axis=0)
        
        rainfall = float(data.get("rainfall", 0))
        river_level = float(data["river_level"])
        humidity = float(data["humidity"])
        slope = float(data["slope"])
        vegetation = float(data["vegetation"])
        past_events = float(data["past_events"])
        
        weather_features = np.array([[
            rainfall,
            river_level,
            humidity,
            slope,
            vegetation,
            past_events
        ]], dtype=np.float32)
        weather_batch = np.expand_dims(weather_features, axis=0)
        
    except (ValueError, TypeError) as e:
        return {"error": "Invalid input values. Please provide valid data."}, 400
    except Exception as e:
        return {"error": f"Error processing input: {str(e)}"}, 400

    try:
        prediction = hybrid_model.predict({'image_input': img_batch, 'weather_input': weather_batch})
        
        flood_pred = float(np.array(prediction[0]).flatten()[0])
        landslide_pred = float(np.array(prediction[1]).flatten()[0])
        
        flood_risk = "High" if flood_pred > 0.5 else "Low"
        landslide_risk = "High" if landslide_pred > 0.5 else "Low"

        return jsonify({
            "city": city,
            "lat": data["lat"],
            "lon": data["lon"],
            "rainfall_mm": rainfall,
            "humidity_percent": humidity,
            "river_level": river_level,
            "slope": slope,
            "vegetation": vegetation,
            "past_events": past_events,
            "flood_risk": flood_risk,
            "landslide_risk": landslide_risk,
            "flood_probability": round(flood_pred, 4),
            "landslide_probability": round(landslide_pred, 4)
        })
    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}, 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
