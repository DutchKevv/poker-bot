# data loader
batch_size = 1
num_workers = 4

data_loader = torch.utils.data.DataLoader(my_dataset,
                                          batch_size=batch_size,
                                          shuffle=False,
                                          num_workers=num_workers
                                         )


import numpy as np
import matplotlib.pyplot as plt

for images, labels in data_loader:
    # image shape is [batch_size, 3 (due to RGB), height, width]
    img = transforms.ToPILImage()(images[0])
    plt.imshow(img)
    plt.show()
    print(labels)
    