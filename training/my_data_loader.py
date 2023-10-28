# path to your own data and coco file
train_data_dir = 'my_data/train'
train_coco = 'my_data/my_train_coco.json'

import my_dataset_torch_coco as myOwnDataset
import matplotlib
import torch

# create own Dataset
my_dataset = myOwnDataset(root=train_data_dir,
                          annotation=train_coco,
                          transforms=matplotlib.spines.Spine.get_transform("my_data")
                          )

# collate_fn needs for batch
def collate_fn(batch):
    return tuple(zip(*batch))

# Batch size
train_batch_size = 1

# own DataLoader
data_loader = torch.utils.data.DataLoader(my_dataset,
                                          batch_size=train_batch_size,
                                          shuffle=True,
                                          num_workers=4,
                                          collate_fn=collate_fn)