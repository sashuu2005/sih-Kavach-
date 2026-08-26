import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, LSTM, Input, Concatenate, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os

def create_hybrid_model():
    # 1. Image Branch (CNN)
    # Using MobileNetV2 for feature extraction from 224x224 RGB images
    image_input = Input(shape=(224, 224, 3), name='image_input')
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_tensor=image_input)
    # Freeze the base model to prevent training its weights for now
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    cnn_features = Dense(64, activation='relu')(x)
    
    # 2. Weather Branch (LSTM)
    # Expecting 6 numerical features as a time-step of 1. Shape: (1, 6)
    weather_input = Input(shape=(1, 6), name='weather_input')
    lstm_out = LSTM(32, activation='relu')(weather_input)
    
    # 3. Fusion Layer
    fused = Concatenate()([cnn_features, lstm_out])
    fused = Dense(64, activation='relu')(fused)
    fused = Dropout(0.3)(fused)
    fused = Dense(32, activation='relu')(fused)
    
    # 4. Output Layer
    # Two outputs: one for flood risk (0-1), one for landslide risk (0-1)
    flood_output = Dense(1, activation='sigmoid', name='flood_risk')(fused)
    landslide_output = Dense(1, activation='sigmoid', name='landslide_risk')(fused)
    
    # Build Model
    model = Model(inputs=[image_input, weather_input], outputs=[flood_output, landslide_output])
    
    # Compile Model
    model.compile(
        optimizer='adam',
        loss={'flood_risk': 'binary_crossentropy', 'landslide_risk': 'binary_crossentropy'},
        metrics=['accuracy']
    )
    
    return model

if __name__ == "__main__":
    print("Building Hybrid CNN + LSTM Model...")
    model = create_hybrid_model()
    model.summary()
    
    # To quickly initialize the weights and create a reproducible model file,
    # we'll train it on a small batch of random synthetic data.
    
    # 100 sample images (224, 224, 3)
    dummy_images = np.random.rand(100, 224, 224, 3).astype('float32')
    # 100 sample weather readings (1 timestep, 6 features)
    dummy_weather = np.random.rand(100, 1, 6).astype('float32')
    
    # Dummy labels (0 or 1 for flood and landslide)
    dummy_flood_labels = np.random.randint(0, 2, size=(100, 1))
    dummy_landslide_labels = np.random.randint(0, 2, size=(100, 1))
    
    print("\nTraining on synthetic data to initialize weights...")
    model.fit(
        {'image_input': dummy_images, 'weather_input': dummy_weather},
        {'flood_risk': dummy_flood_labels, 'landslide_risk': dummy_landslide_labels},
        epochs=1,
        verbose=1
    )
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'hybrid_model.h5')
    model.save(model_path)
    print(f"\nModel saved successfully at: {model_path}")
