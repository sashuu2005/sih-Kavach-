import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

data = pd.read_csv("landslide_dataset.csv")
X = data.drop("Landslide", axis=1)

landslide_model = RandomForestClassifier()

landslide_model.fit(X, data["Landslide"])

with open("landslide_model.pkl", "wb") as model_file:
	pickle.dump(landslide_model, model_file)

print("Landslide model trained successfully")


#random forest classifer
