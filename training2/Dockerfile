FROM tensorflow/tensorflow:2.8.4
# FROM python:3.7.9-alpine3.13

WORKDIR /project
COPY  ./project .

# RUN apt-get update
# RUN sudo apt -y install libportaudio2 ffmpeg libsm6 libxext6
RUN apt -y install libusb-1.0-0-dev
RUN pip3 install --upgrade pip setuptools wheel
RUN pip3 install tflite-model-maker numpy==1.23.5 pycocotools
# RUN pip3 install --no-use-pep517 opencv-python-headless
# RUN pip3 install -r requirements.txt