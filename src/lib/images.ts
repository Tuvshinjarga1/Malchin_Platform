// Browser-compatible image upload function for ImgBB
export async function uploadImage(imageFile: File): Promise<string> {
  try {
    // Convert File to base64
    const base64string = await fileToBase64(imageFile);

    // Remove data:image/jpeg;base64, part
    const base64Data = base64string.split(",")[1];

    // Create form data for ImgBB API
    const formData = new FormData();
    formData.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY || ""); // Use NEXT_PUBLIC_ prefix
    formData.append("image", base64Data);

    // Upload to ImgBB API
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ImgBB API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "ImgBB upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Зураг хуулахад алдаа гарлаа");
  }
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Жишээ ашиглах:
/*
const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    try {
      const imageUrl = await uploadImage(event.target.files[0]);
      console.log('Uploaded image URL:', imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
};
*/
