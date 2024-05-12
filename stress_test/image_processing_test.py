from locust import HttpUser, task, between
import os
import random

class ImageUploadUser(HttpUser):
    wait_time = lambda self: 1 # 대기 시간
    image_files = os.listdir("./test_images")
    
    @task
    def upload_image(self):
        url = '/api/image-process/image'  # 이미지를 업로드할 경로
        image_path = self.image_files[random.randint(0, 16)]  # 업로드할 이미지의 경로
        with open(f'./test_images/{image_path}', 'rb') as image:
            files = {'file': (os.path.basename(image_path), image, 'image/jpeg')}
            self.client.post(url, files=files)
