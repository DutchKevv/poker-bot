import fiftyone as fo

# Create a dataset from a list of images
# dataset = fo.Dataset.from_images(
#     ["/path/to/image1.jpg", "/path/to/image2.jpg", ...]
# )

# # Create a dataset from a directory of images
# dataset = fo.Dataset.from_images_dir("/path/to/images")

# Create a dataset from a glob pattern of images
dataset = fo.Dataset.from_images_patt("../data/cards/*.png")


# The directory to which to write the exported dataset
export_dir = "./sdfsf"

#

session = fo.launch_app(dataset)

# The name of the sample field containing the label that you wish to export
# Used when exporting labeled datasets (e.g., classification or detection)
label_field = "ground_truth"  # for example


# The type of dataset to export
# Any subclass of `fiftyone.types.Dataset` is supported
dataset_type = fo.types.COCODetectionDataset  # for example

# Export the dataset
# dataset.export(
#     export_dir=export_dir,
#     dataset_type=dataset_type,
#     label_field=label_field,
# )

# Blocks execution until the App is closed
session.wait()

# Edit the tags
dataset.tags.pop()
dataset.tags.append("projectB")
dataset.save()  # must save after edits