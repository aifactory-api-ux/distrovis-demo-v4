FROM kong:3.4

WORKDIR /app

COPY kong.yml ./

EXPOSE 8000

CMD ["kong", "start"]