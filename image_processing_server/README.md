# LOA 영상처리 서버
FastAPI

## 필요한 라이브러리 설치
```shell
pip install -r requirements.txt
```

## 서버 실행 (기본 포트번호: 8000)
```shell
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 개발 서버 실행
```shell
uvicorn main:app --reload
```