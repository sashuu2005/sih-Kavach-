import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, LSTM, Input, Concatenate, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import os

def create_hybrid_model():
    image_input = Input(shape=(224, 224, 3), name='image_input')
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_tensor=image_input)
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    cnn_features = Dense(64, activation='relu')(x)
    
    weather_input = Input(shape=(1, 6), name='weather_input')
    lstm_out = LSTM(32, activation='relu')(weather_input)
    
    fused = Concatenate()([cnn_features, lstm_out])
    fused = Dense(64, activation='relu')(fused)
    fused = Dropout(0.3)(fused)
    fused = Dense(32, activation='relu')(fused)
    
    flood_output = Dense(1, activation='sigmoid', name='flood_risk')(fused)
    landslide_output = Dense(1, activation='sigmoid', name='landslide_risk')(fused)
    
    model = Model(inputs=[image_input, weather_input], outputs=[flood_output, landslide_output])
    
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
    
    dummy_images = np.random.rand(100, 224, 224, 3).astype('float32')
    dummy_weather = np.random.rand(100, 1, 6).astype('float32')
    
    dummy_flood_labels = np.random.randint(0, 2, size=(100, 1))
    dummy_landslide_labels = np.random.randint(0, 2, size=(100, 1))
    
    print("\nTraining on synthetic data to initialize weights...")
    model.fit(
        {'image_input': dummy_images, 'weather_input': dummy_weather},
        {'flood_risk': dummy_flood_labels, 'landslide_risk': dummy_landslide_labels},
        epochs=1,
        verbose=1
    )
    
    model_path = os.path.join(os.path.dirname(__file__), 'hybrid_model.h5')
    model.save(model_path)
    print(f"\nModel saved successfully at: {model_path}")
