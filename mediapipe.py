import sys
import json

if __name__ == "__main__":
    base64_image_data = sys.stdin.read() # Node.js에서 받아온 데이터
    result = {
        "isBlank": 0,
        "isSleep": 1
    }
    print(json.dumps(result))