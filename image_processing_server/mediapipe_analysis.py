import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import base64
import numpy as np
import json
import sys
import os

def base64ToImage(base64_string):
    # Base64 문자열을 바이트 배열로 디코딩
    imgdata = base64.b64decode(base64_string)
    
    # 바이트 배열을 NumPy 배열로 변환
    nparr = np.frombuffer(imgdata, np.uint8)
    
    # NumPy 배열을 이미지로 읽기
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 이미지를 RGB로 변환 (mediapipe가 RGB를 사용함)
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

def checkImage(base64_string):
    current_file_path = os.path.abspath(__file__)
    current_dir_path = os.path.dirname(current_file_path)
    # STEP 2: Create an FaceLandmarker object.
    base_options = python.BaseOptions(model_asset_path=f'{current_dir_path}/face_landmarker_v2_with_blendshapes.task')
    options = vision.FaceLandmarkerOptions(base_options=base_options,
                                        output_face_blendshapes=True,
                                        output_facial_transformation_matrixes=True,
                                        num_faces=1)
    detector = vision.FaceLandmarker.create_from_options(options)

    # STEP 3: Load the input image.
    image_rgb = base64ToImage(base64_string)

    # STEP 4: Convert the image to Mediapipe format.
    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    # STEP 5: Detect face landmarks from the input image.
    detection_result = detector.detect(image)

    isExist = True
    isEyeClosed = False
    if(detection_result.face_blendshapes):
        # 눈감음
        if(detection_result.face_blendshapes[0][9].score > 0.4500 and detection_result.face_blendshapes[0][10].score > 0.4500):
            isEyeClosed = True
    else:
        # 자리이탈
        isExist = False
    
    result = {
        "isExist" : isExist,
        "isEyeClosed" : isEyeClosed
    }
    return result

if __name__ == "__main__":
    base64_image_data = sys.stdin.read() # Node.js에서 받아온 데이터
    result = checkImage(base64_image_data)
    print(result)