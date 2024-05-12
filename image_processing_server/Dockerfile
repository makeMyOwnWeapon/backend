# 기본 이미지로 Python 3.11 슬림 버전을 사용
FROM python:3.11-slim

# 작업 디렉토리 설정(컨테이너 내부)
WORKDIR /app

# 필요한 시스템 패키지 설치
# apt-get update를 실행하고 필요한 패키지를 설치한다.
# 설치 후 임시 파일 삭제!
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 필요한 패키지와 라이브러리 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드를 컨테이너에 복사
COPY ./ /app

# Uvicorn을 사용하여 호스트 0.0.0.0, 포트 8000에서 애플리케이션 실행
# main:app은 main.py 파일의 FastAPI 인스턴스 이름이 app임을 의미
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
