export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload/cloudinary', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    // Backend returns an array of images, we take the first one
    if (!data.images || !data.images.length) {
      throw new Error('No image URL received from server');
    }
    return data.images[0]; // Return the first image URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
