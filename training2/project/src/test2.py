import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import os
import cv2
import random
TRAIN_DIR=r"E:\Projects\poker-bot\training2\project\data\archive\Images"

tsb=tf.keras.callbacks.TensorBoard(log_dir="logs")

classes=[i for i in os.listdir(TRAIN_DIR)]

train=[]
for i in os.listdir(TRAIN_DIR):
    current_path=os.path.join(TRAIN_DIR,i)
    current_class=classes.index(i)
    for j in os.listdir(current_path):
        try:
            img=cv2.imread(os.path.join(TRAIN_DIR,i,j),cv2.IMREAD_GRAYSCALE)
            img=cv2.resize(img,(70,70))
        except:
            continue
        train.append([img,current_class])
random.shuffle(train)
x=[]
y=[]
for i,j in train:
    x.append(i)
    y.append(j)
x=np.array(x)/255.0
y=np.array(y)
print(f"Total Train Images : {len(x)}")

model=tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(64,(3,3),activation=tf.nn.relu,input_shape=(70,70,1)),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64,(3,3),activation=tf.nn.relu),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Conv2D(64,(3,3),activation=tf.nn.relu),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(512,activation=tf.nn.relu),
    tf.keras.layers.Dropout(0.25),
    tf.keras.layers.Dense(256,activation=tf.nn.relu),
    tf.keras.layers.Dense(len(classes),activation=tf.nn.softmax)
])

model.summary()

model.compile(optimizer="adam",loss="sparse_categorical_crossentropy",metrics=["accuracy"])

history=model.fit(x,y,epochs=10,callbacks=[tsb],validation_split=0.1)

# def prepare(filepath):
#     img=cv2.imread(filepath,cv2.IMREAD_GRAYSCALE)
#     img=cv2.resize(img,(70,70))
#     return img.reshape(-1,70,70,1)

# path=r"C:\Users\speed\Documents\Playing Cards Classification TensorFlow CNN\data\test\ace of clubs\2.jpg"
# print(classes[int(np.argmax(model.predict(prepare(path))))])
# plt.imshow(plt.imread(path))

model.save("64x3-cards.h5")

tf_lite_converter=tf.lite.TFLiteConverter.from_keras_model(model)
with open("64x3-cards.tflite","wb") as f:
    f.write(tf_lite_converter.convert())