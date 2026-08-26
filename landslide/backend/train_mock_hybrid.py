import numpy as np
import pickle
import os

class MockHybridModel:
    """
    A simulated CNN + LSTM model to bypass Python 3.14 compatibility issues with TensorFlow.
    It takes an image and weather data and outputs a mock prediction between 0 and 1.
    """
    def __init__(self):
        self.name = "Mock_CNN_LSTM"

    def predict(self, inputs):
        img_batch = inputs.get('image_input')
        weather_batch = inputs.get('weather_input')
        
        # Simulate CNN feature extraction (e.g., mean pixel value)
        cnn_features = np.mean(img_batch) if img_batch is not None else 0.5
        
        # Simulate LSTM processing (e.g., sum of weather features normalized)
        lstm_features = np.sum(weather_batch) / 1000.0 if weather_batch is not None else 0.5
        
        # Fusion and simulated risk generation based on real-time inputs
        flood_risk = np.clip(cnn_features * 0.5 + lstm_features * 1.5, 0.1, 0.9)
        landslide_risk = np.clip(cnn_features * 0.7 + lstm_features * 1.8, 0.1, 0.9)
        
        # Return format matching Keras multi-output: [flood_array, landslide_array]
        return [
            np.array([[[flood_risk]]]),
            np.array([[[landslide_risk]]])
        ]

if __name__ == "__main__":
    print("Building Mock Hybrid CNN + LSTM Model (Numpy)...")
    model = MockHybridModel()
    
    # Save the mock model
    model_path = os.path.join(os.path.dirname(__file__), 'mock_hybrid_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Mock Hybrid Model saved successfully at: {model_path}")
