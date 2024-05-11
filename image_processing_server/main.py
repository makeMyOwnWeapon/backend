import base64
from typing import Annotated, Union

from fastapi import FastAPI, File, UploadFile

import mediapipe_analysis

app = FastAPI()

@app.post("/api/image-process/image")
async def create_file(file: UploadFile):
    image_data = await file.read()
    # 읽은 이미지 데이터를 base64로 인코딩합니다.
    base64_encoded_data = base64.b64encode(image_data)
    
    # base64_encoded_data는 bytes이므로, 이를 문자열로 변환합니다.
    base64_encoded_str = base64_encoded_data.decode('utf-8')
    
    # 수정된 부분: base64 문자열을 mediapipe_analysis.checkImage에 전달합니다.
    return mediapipe_analysis.checkImage(base64_encoded_str)