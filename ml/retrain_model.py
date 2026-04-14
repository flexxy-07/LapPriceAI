import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

import sys
def log(msg):
    print(msg)
    sys.stdout.flush()

log("Starting retraining process...")

# Get absolute path to the directory of this script
FILE_DIR = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.dirname(FILE_DIR)
dataset_path = os.path.join(base_dir, "dataset", "laptop_price.csv")
model_path = os.path.join(base_dir, "backend", "model.pkl")

log(f"Loading dataset from: {dataset_path}")
# Load dataset
try:
    df = pd.read_csv(dataset_path, encoding="latin1")
    log(f"Dataset loaded. Shape: {df.shape}")
except Exception as e:
    log(f"CRITICAL: Failed to load dataset: {e}")
    sys.exit(1)

# --- DATA CLEANING ---
log("Cleaning data...")

# 1. Cleaning Ram (8GB -> 8)
df['Ram'] = df['Ram'].str.replace('GB', '').astype(int)

# 2. Cleaning Weight (1.37kg -> 1.37)
df['Weight'] = df['Weight'].str.replace('kg', '').astype(float)

# 3. Features from ScreenResolution
df['Touchscreen'] = df['ScreenResolution'].apply(lambda x: 1 if 'Touchscreen' in x else 0)
df['IPS'] = df['ScreenResolution'].apply(lambda x: 1 if 'IPS' in x else 0)

# Extract PPI (Pixels Per Inch)
res = df['ScreenResolution'].str.extract(r'(\d+)x(\d+)')
df['X_res'] = res[0].astype(int)
df['Y_res'] = res[1].astype(int)
df['PPI'] = (((df['X_res']**2) + (df['Y_res']**2))**0.5 / df['Inches']).astype(float)

# 4. CPU Brand Extraction
def fetch_cpu_brand(text):
    words = text.split()
    if words[0] == 'Intel':
        return " ".join(words[:3])
    else:
        return words[0]

df['Cpu Brand'] = df['Cpu'].apply(fetch_cpu_brand)

# 5. Storage (SSD/HDD) Extraction
df['Memory'] = df['Memory'].astype(str).replace(r'\.0', '', regex=True)
df["Memory"] = df["Memory"].str.replace('GB', '')
df["Memory"] = df["Memory"].str.replace('TB', '000')
new = df["Memory"].str.split("+", n = 1, expand = True)

df["first"]= new[0]
df["first"]=df["first"].str.strip()

df["second"]= new[1]

df["Layer1HDD"] = df["first"].apply(lambda x: 1 if "HDD" in x else 0)
df["Layer1SSD"] = df["first"].apply(lambda x: 1 if "SSD" in x else 0)

df['first'] = df['first'].str.replace(r'\D', '', regex=True)

df["second"].fillna("0", inplace = True)

df["Layer2HDD"] = df["second"].apply(lambda x: 1 if "HDD" in x else 0)
df["Layer2SSD"] = df["second"].apply(lambda x: 1 if "SSD" in x else 0)

df['second'] = df['second'].str.replace(r'\D', '', regex=True)

df["first"] = df["first"].astype(int)
df["second"] = df["second"].astype(int)

df["HDD"]=(df["first"]*df["Layer1HDD"]+df["second"]*df["Layer2HDD"])
df["SSD"]=(df["first"]*df["Layer1SSD"]+df["second"]*df["Layer2SSD"])

# 6. GPU Brand Extraction
df['Gpu Brand'] = df['Gpu'].apply(lambda x: x.split()[0])

log("Data cleaning complete.")

# Prepare X and y
X = df[['Company', 'Product', 'TypeName', 'Ram', 'OpSys', 'Weight', 'Touchscreen', 'IPS', 'PPI', 'Cpu Brand', 'Gpu Brand', 'SSD', 'HDD']]
y = df['Price_euros']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=2)

log(f"Training on {X_train.shape[0]} samples...")

# Column Transformer
categorical_cols = ['Company', 'Product', 'TypeName', 'OpSys', 'Cpu Brand', 'Gpu Brand']
numerical_cols = ['Ram', 'Weight', 'Touchscreen', 'IPS', 'PPI', 'HDD', 'SSD']

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), categorical_cols),
        ('num', StandardScaler(), numerical_cols)
    ],
    remainder='drop'
)

# Pipe
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(n_estimators=100, random_state=3, max_samples=0.5, max_features=0.75, max_depth=15))
])

# Train
log("Fitting pipeline... this might take a moment.")
pipeline.fit(X_train, y_train)

# Output evaluation for verification
train_score = pipeline.score(X_train, y_train)
test_score = pipeline.score(X_test, y_test)
log(f"Train R2: {train_score:.4f}")
log(f"Test R2: {test_score:.4f}")

# Save model
joblib.dump(pipeline, model_path)
log(f"Model saved to {model_path}")
log("DONE")

