# pyrefly: ignore [missing-import]
from flask import Flask
import os

app = Flask(__name__)

# Middleware pour autoriser le CORS (indispensable pour que le frontend communique avec le backend)
@app.after_request
def after_request(response): 
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/")
def home():
    return "Flask + Docker + GHCR + Terraform + Render"

@app.route("/health")
def health():
    return {"status": "Tout est ok ou pas"}

@app.route("/info")
def info():
    return {
        "app": "Flask Render",
        "student": "Theo Lemray",
        "version": "v1"
    }
    
@app.route("/env")
def env():
    return {"env": os.getenv("ENV")}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

