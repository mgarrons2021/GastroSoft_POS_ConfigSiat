###

FROM    node:16

RUN     apt-get update && apt-get install -y dos2unix
RUN     npm install -g http-server

ADD     ./docker/start.sh /root/start.sh

RUN     dos2unix /root/start.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*
RUN     chmod 755 /root/start.sh
# The default port of the application
EXPOSE  8080

CMD ["/root/start.sh"]