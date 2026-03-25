from newspaper import Article
from PIL import Image
import pytesseract
import io
import cv2
import numpy as np
from fastapi import UploadFile

def extract_from_url(url: str) -> dict:
    try:
        article = Article(url)
        article.download()
        article.parse()
        return {
            "title": article.title,
            "text": article.text,
            "authors": article.authors,
            "publish_date": article.publish_date,
            "source_url": url
        }
    except Exception as e:
        return {
            "title": "Error extracting URL",
            "text": "Could not extract content from the provided URL.",
            "authors": [],
            "publish_date": None,
            "source_url": url,
            "error": str(e)
        }

def extract_from_image(file: UploadFile) -> dict:
    try:
        contents = file.file.read()
        
        try:
            # OpenCV Preprocessing for better OCR
            np_arr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Could not decode image")
                
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Noise removal via median blur
            blur = cv2.medianBlur(gray, 3)
            
            # Thresholding
            thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
            
            text = pytesseract.image_to_string(thresh)
            
        except Exception as cv_err:
            print(f"OpenCV processing failed, falling back to PIL: {cv_err}")
            # Fallback to basic PIL processing
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image)
            
        return {"extracted_text": text}
    except Exception as e:
        return {"extracted_text": "", "error": str(e)}
