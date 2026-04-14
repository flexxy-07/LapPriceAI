from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import uvicorn
import os

app = FastAPI()

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
DATASET_PATH = os.path.join(os.path.dirname(BASE_DIR), "dataset", "laptop_price.csv")

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        print(f"CRITICAL: Model file not found at {MODEL_PATH}")
        model = None
except Exception as e:
    print(f"CRITICAL: Error loading model: {e}")
    model = None

class LaptopInput(BaseModel):
    Company: str
    Product: str
    TypeName: str
    Ram: int
    OpSys: str
    Weight: float
    Touchscreen: int
    IPS: int
    PPI: float
    Cpu_Brand: str
    Gpu_Brand: str
    SSD: int
    HDD: int

@app.get("/")
def home():
    return {"message": "Laptop Price Predictor API Running"}

@app.post("/predict")
def predict(data: LaptopInput):
    if model is None:
        return {"error": "Model not loaded. Check backend logs."}
    
    input_df = pd.DataFrame([{
        "Company": data.Company,
        "Product": data.Product,
        "TypeName": data.TypeName,
        "Ram": data.Ram,
        "OpSys": data.OpSys,
        "Weight": data.Weight,
        "Touchscreen": data.Touchscreen,
        "IPS": data.IPS,
        "PPI": data.PPI,
        "Cpu Brand": data.Cpu_Brand,
        "Gpu Brand": data.Gpu_Brand,
        "SSD": data.SSD,
        "HDD": data.HDD
    }])

    prediction = model.predict(input_df)
    return {
        "predicted_price": round(prediction[0], 2)
    }

@app.get("/metadata")
def get_metadata():
    try:
        if not os.path.exists(DATASET_PATH):
            return {"error": f"Dataset not found at {DATASET_PATH}"}
            
        df = pd.read_csv(DATASET_PATH, encoding="latin1")
        
        # Clean data similar to training (simplified for metadata)
        def fetch_cpu_brand(text):
            words = text.split()
            if words[0] == 'Intel':
                return " ".join(words[:3])
            else:
                return words[0]

        df['Cpu Brand'] = df['Cpu'].apply(fetch_cpu_brand)
        df['Gpu Brand'] = df['Gpu'].apply(lambda x: x.split()[0])
        
        metadata = {
            "companies": sorted(df['Company'].unique().tolist()),
            "types": sorted(df['TypeName'].unique().tolist()),
            "opsys": sorted(df['OpSys'].unique().tolist()),
            "cpu_brands": sorted(df['Cpu Brand'].unique().tolist()),
            "gpu_brands": sorted(df['Gpu Brand'].unique().tolist()),
        }
        return metadata
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
