FROM amazon/aws-cli:2.17.49

RUN yum install -y curl jq zip && yum clean all

WORKDIR /workspace

ENTRYPOINT ["/bin/sh"]
