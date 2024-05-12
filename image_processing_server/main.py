import base64

from fastapi import FastAPI, UploadFile

import mediapipe_analysis

app = FastAPI()

async def process_image(image_data):
    base64_encoded_data = base64.b64encode(image_data)
    base64_encoded_str = base64_encoded_data.decode('utf-8')
    return mediapipe_analysis.check_image(base64_encoded_str)

@app.post("/api/image-process/image")
async def create_file(file: UploadFile):
    result = await process_image(await file.read())
    return result

@app.get("/api/image-process/health-check")
def create_file():
    return { "message" : 'OK' }