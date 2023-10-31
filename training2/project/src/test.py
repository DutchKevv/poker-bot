import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import os

os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'
model_path = 'tmp.tflite'
INPUT_IMAGE_PATH = "./data/table/dog.jpg"

print("Num GPUs Available: ", len(tf.config.list_physical_devices('GPU')))

# imported = tf.saved_model.load(model_path6)
# Load TFLite model and allocate tensors.
print('LOADING MODEL')
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
# print(input_details)
# print(output_details)
# print()

input_shape = input_details[0]['shape']
im = cv2.imread(INPUT_IMAGE_PATH)
im_rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB)
im_rgb = cv2.resize(im_rgb, (input_shape[1], input_shape[2]))
input_data = np.expand_dims(im_rgb, axis=0)
# print(input_data.shape)
# print()

interpreter.set_tensor(input_details[0]['index'], input_data)


COLORS = []
classes = []
scores = []
def detect_objects(interpreter, image, threshold):
  """Returns a list of detection results, each a dictionary of object info."""

  global COLORS
  global classes
  global scores
      #   signature_fn = interpreter.get_signature_runner()

      # Feed the input image to the model
      #   output = signature_fn(images=image)

  print('EXECUTING MODEL')
  interpreter.invoke()  

  detection_classes = interpreter.get_tensor(output_details[2]['index'])
  # Load the labels into a list
  classes = ['???'] * len(detection_classes)
  print(detection_classes)
  # label_map = model.model_spec.config.label_map
  # for label_id, label_name in label_map.as_dict().items():
  #   classes[label_id-1] = label_name
  
  output = interpreter.get_tensor(output_details[0]['index'])
  output = output[0]
  output = output.T  # output shape:(8400, 281)

  # boxes = interpreter.get_tensor(output_details[1]['index'])

  boxes = output[..., :4]
  scores = output[..., 4:5]
  classes = np.argmax(output[..., 5:], axis=1)
  count = len(boxes)
  print('socres', output)
  print('boxes', boxes)

  COLORS = np.random.randint(0, 255, size=(len(classes), 3), dtype=np.uint8)

#   output_details = interpreter.get_output_details()
#   output = np.squeeze(interpreter.get_tensor(output_details[0]['index']))
#   results = np.squeeze(output_details)
#   print('output_details', output_details)	
#   print('results', results)	

#   num_boxes = interpreter.get_tensor(output_details[3]['index'])
#   print('num_boxes', int(num_boxes[0]))
  
#   count =  interpreter.get_tensor(output_details[0]['index'])
#   scores = interpreter.get_tensor(output_details[1]['index'])
#   classes = interpreter.get_tensor(output_details[2]['index'])
#   boxes = interpreter.get_tensor(output_details[3]['index'])

#   Get all outputs from the model
#   count = int(np.squeeze(output['output_0']))
#   scores = np.squeeze(output['output_1'])
#   classes = np.squeeze(output['output_2'])
#   boxes = np.squeeze(output['output_3'])


  results = []
  for i in range(count):
    if scores[i] >= threshold:
      result = {
        'bounding_box': boxes[i],   
        'class_id': classes[i],
        'score': scores[i]
      }
      results.append(result)

  print('results', len(results))
  return results

def preprocess_image(image_path, input_size):
  """Preprocess the input image to feed to the TFLite model"""
  img = tf.io.read_file(image_path)
  img = tf.io.decode_image(img, channels=3)
  img = tf.image.convert_image_dtype(img, tf.uint8)
  original_image = img
  resized_img = tf.image.resize(img, input_size)
  resized_img = resized_img[tf.newaxis, :]
  resized_img = tf.cast(resized_img, dtype=tf.uint8)
  return resized_img, original_image

def mergeImages(image_path, interpreter):
  _, input_height, input_width, _ = interpreter.get_input_details()[0]['shape']

  # Load the input image and preprocess it
  preprocessed_image, original_image = preprocess_image(
    image_path,
    (input_height, input_width)
  )

  # Run object detection on the input image
  results = detect_objects(interpreter, preprocessed_image, threshold=0.3)

  original_image_np = original_image.numpy().astype(np.uint8)
  for obj in results:
    # Convert the object bounding box from relative coordinates to absolute
    # coordinates based on the original image resolution
    ymin, xmin, ymax, xmax = obj['bounding_box']
    xmin = int(xmin * original_image_np.shape[1])
    xmax = int(xmax * original_image_np.shape[1])
    ymin = int(ymin * original_image_np.shape[0])
    ymax = int(ymax * original_image_np.shape[0])

    # Find the class index of the current object
    class_id = int(obj['class_id'])

    # Draw the bounding box and label on the image
    color = 4
    # color = [int(c) for c in COLORS[class_id]]
    cv2.rectangle(original_image_np, (xmin, ymin), (xmax, ymax), color, 2)
    # Make adjustments to make the label visible for all objects
    y = ymin - 15 if ymin - 15 > 15 else ymin + 15
    label = "TEST"
    # label = "{}: {:.0f}%".format(classes[class_id], obj['score'] * 100)
    cv2.putText(original_image_np, label, (xmin, y),
        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

  # Return the final image
  original_uint8 = original_image_np.astype(np.uint8)
  return original_uint8

detection_result_image = mergeImages(INPUT_IMAGE_PATH, interpreter)

plt.imshow(detection_result_image)
plt.axis('off')
plt.show()
plt.savefig("./results/result.png", dpi=700)

exit()

interpreter.allocate_tensors()