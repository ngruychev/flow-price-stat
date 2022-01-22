FROM denoland/deno:1.17.2

WORKDIR /app

USER deno

COPY main.ts .
RUN deno cache main.ts

ADD . .
RUN deno cache main.ts

CMD ["run", "-A", "main.ts"]
