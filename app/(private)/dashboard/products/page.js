"use client";

import ProductImageUpload from "@/components/ProductImageUpload";

export default function ProductsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Product Management</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Upload Product Image</h2>
              
              <ProductImageUpload 
                onImageUploaded={(imageData) => {
                  // Here you would typically save the image URL to your product
                  // For example:
                  // - imageData.url: The secure URL of the uploaded image
                  // - imageData.publicId: The public ID for managing the image
                  // - imageData.width: Image width
                  // - imageData.height: Image height
                }}
              />
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Integration Example</h2>
              <div className="prose">
                <p>To integrate Cloudinary in your product forms:</p>
                <ol>
                  <li>Import the ProductImageUpload component</li>
                  <li>Handle the onImageUploaded callback</li>
                  <li>Save the returned URL to your database</li>
                </ol>
                
                <div className="mockup-code mt-4">
                  <pre data-prefix="$"><code>{`// In your product form:
const [productImage, setProductImage] = useState("");

<ProductImageUpload 
  onImageUploaded={(data) => {
    setProductImage(data.url);
  }}
/>`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold">Setup Required</h3>
            <p>Make sure to add your Cloudinary credentials to your .env.local file:</p>
            <ul className="list-disc list-inside mt-2">
              <li>CLOUDINARY_CLOUD_NAME</li>
              <li>CLOUDINARY_API_KEY</li>
              <li>CLOUDINARY_API_SECRET</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}