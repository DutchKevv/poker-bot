# FROM tensorflow/tensorflow:2.8.3-gpu
FROM rocm/tensorflow:rocm5.7-tf2.13-dev
# FROM python:3.7.9-alpine3.13

RUN apt-get update && \
    apt -y install libusb-1.0-0-dev
# RUN sudo apt -y install libportaudio2 ffmpeg libsm6 libxext6
RUN pip3 install --upgrade pip setuptools wheel      
# RUN pip3 install --no-use-pep517 opencv-python-headless

WORKDIR /project
COPY  ./project .

RUN pip3 install -r requirements.txt

# RUN cd models/research \
#     && protoc object_detection/protos/*.proto --python_out=. \
#     && cp object_detection/packages/tf2/setup.py . && \
#     python3 -m pip install --use-feature=2020-resolver .