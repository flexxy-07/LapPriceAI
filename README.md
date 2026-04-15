# LapPriceAI

LapPriceAI is a Machine Learning based laptop price prediction system that estimates the market price of a laptop based on its specifications. The project is available as both a **Web Application** and an **Android Mobile Application**, enabling users to access predictions seamlessly across multiple platforms.

## Overview

This project was developed as a complete end-to-end Machine Learning solution involving:
- Data preprocessing and feature engineering  
- Model training and evaluation  
- Backend API integration  
- Web and mobile application development  

## Dataset

The dataset was sourced from Kaggle and contains laptop specifications with pricing information.

- Original prices in the dataset were in **Euros (€)**  
- Since the application targets Indian users, prices were converted and displayed in **Indian Rupees (INR)** for regional relevance  

## Features Used

The model predicts laptop price based on:
- Brand / Company  
- Product Name  
- Laptop Type  
- RAM  
- Operating System  
- Weight  
- Touchscreen  
- IPS Display  
- PPI  
- CPU Brand  
- GPU Brand  
- SSD / HDD Capacity  

## Machine Learning Pipeline

- Cleaned and preprocessed the dataset  
- Performed Exploratory Data Analysis (EDA)  
- Applied Feature Engineering on CPU, GPU, storage, and display data  
- Trained and compared multiple regression models:
  - Linear Regression  
  - Random Forest Regressor  
  - Decision Tree Regressor  
- Applied Hyperparameter Tuning using GridSearchCV  

## Tech Stack

- **Machine Learning & Data Processing:** Python, Pandas, NumPy, Scikit-learn  
- **Visualization & EDA:** Matplotlib, Seaborn  
- **Backend/API:** FastAPI  
- **Web Frontend:** React.js  
- **Mobile Application:** Flutter  
- **Deployment:** Render  

## Platforms

- **Web Application:** Responsive browser-based interface for laptop price prediction  
- **Android Application:** Flutter-based APK for mobile predictions  
- **Backend Service:** Hosted API serving real-time predictions  

## Conclusion

LapPriceAI demonstrates a complete Machine Learning workflow integrated into real-world deployment through both web and mobile applications, providing accurate and accessible laptop price predictions via an interactive platform.
