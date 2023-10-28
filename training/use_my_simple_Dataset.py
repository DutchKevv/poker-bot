
from my_simple_Dataset import simpleDataset
# data directory
root = "my_data"

# assume we have 3 jpg images
filenames = ['img1.jpg', 'img2.jpg', 'img3.jpg']

# the class of image might be ['black cat', 'tabby cat', 'tabby cat']
labels = [0, 1, 1]

# create own Dataset
my_dataset = simpleDataset(root=root,
                           filenames=filenames,
                           labels=labels
                           )