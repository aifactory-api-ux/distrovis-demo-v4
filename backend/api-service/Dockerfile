FROM python:3.11-slim

WORKDIR /app

COPY backend/api-service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/api-service/src/ ./src/
COPY backend/shared/ ./backend/shared/
COPY shared/ ./shared/

EXPOSE 8001

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
