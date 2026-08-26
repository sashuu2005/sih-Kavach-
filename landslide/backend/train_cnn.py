import os
import shutil
import kagglehub
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 1. Download Dataset using kagglehub
print("Downloading dataset from Kaggle...")
download_path = kagglehub.dataset_download("dhawalsrivastava2583/flood-classification-dataset")
print(f"Dataset downloaded to cache at: {download_path}")

# 2. Store in backend/dataset/images/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset", "images")

if os.path.exists(DATASET_DIR):
    shutil.rmtree(DATASET_DIR)
os.makedirs(DATASET_DIR, exist_ok=True)

# Copy contents from cache to local dataset directory
print(f"Copying dataset to {DATASET_DIR}...")
for item in os.listdir(download_path):
    s = os.path.join(download_path, item)
    d = os.path.join(DATASET_DIR, item)
    if os.path.isdir(s):
        shutil.copytree(s, d, dirs_exist_ok=True)
    else:
        shutil.copy2(s, d)
print("Dataset successfully stored in 'dataset/images/'.")

# 3. Train CNN Model
print("\nPreparing to Train CNN Model...")
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

# Since we don't know the exact subfolder structure (train/val vs class folders),
# we will use the DATASET_DIR as the root. If the dataset has 'train' and 'test' folders,
# you might need to append 'train' below instead.
# For standard Kaggle image datasets, if they are structured as dataset/images/class_name/...
try:
    datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2, # Use 20% for validation
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True
    )
    
    # We assume 'dataset/images' either contains class subfolders directly, OR an inner folder.
    # If the download has an inner folder, e.g. "Flood_Images", we find it.
    subdirs = [f.path for f in os.scandir(DATASET_DIR) if f.is_dir()]
    train_dir = DATASET_DIR
    
    # Check if there's only one root folder inside e.g. "Flood Classification"
    if len(subdirs) == 1 and os.path.isdir(subdirs[0]):
        train_dir = subdirs[0]

    train_generator = datagen.flow_from_directory(
        train_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary', # Assumes Flood vs No-Flood
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        train_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='validation'
    )

    num_classes = len(train_generator.class_indices)
    class_mode = 'binary' if num_classes <= 2 else 'categorical'
    loss_function = 'binary_crossentropy' if num_classes <= 2 else 'categorical_crossentropy'
    activation = 'sigmoid' if num_classes <= 2 else 'softmax'

    print(f"Detected {num_classes} classes: {list(train_generator.class_indices.keys())}")

    # Build CNN Architecture (MobileNetV2 Base)
    print("Building CNN Model architecture...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False # Freeze base weights

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(1 if num_classes <= 2 else num_classes, activation=activation)(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer='adam', loss=loss_function, metrics=['accuracy'])

    print("Starting Model Training...")
    epochs = 10 # Adjust based on requirement
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=epochs
    )

    # Save trained CNN model
    save_path = os.path.join(BASE_DIR, 'cnn_flood_model.h5')
    model.save(save_path)
    print(f"\nModel training complete! Model saved to: {save_path}")

except Exception as e:
    print(f"Error during CNN setup/training: {e}")
    print("Please check the structure of 'dataset/images/' to ensure subfolders match class names.")
