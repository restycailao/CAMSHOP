const CategoryForm = ({
  value,
  setValue,
  cameraType,
  setCameraType,
  sensorSize,
  setSensorSize,
  primaryUseCase,
  setPrimaryUseCase,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-3 px-4 border rounded-lg w-full"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <select
          className="py-3 px-4 border rounded-lg w-full text-black"
          value={cameraType}
          onChange={(e) => setCameraType(e.target.value)}
        >
          <option value="">Select Camera Type</option>
          <option value="DSLR (Digital Single-Lens Reflex) Cameras">DSLR (Digital Single-Lens Reflex) Cameras</option>
          <option value="Compact/Point-and-Shoot Cameras">Compact/Point-and-Shoot Cameras</option>
          <option value="Action Cameras">Action Cameras</option>
          <option value="360-Degree Cameras">360-Degree Cameras</option>
          <option value="Instant Cameras">Instant Cameras</option>
        </select>

        <select
          className="py-3 px-4 border rounded-lg w-full text-black"
          value={sensorSize}
          onChange={(e) => setSensorSize(e.target.value)}
        >
          <option value="">Select Sensor Size</option>
          <option value="Full-Frame Cameras">Full-Frame Cameras</option>
          <option value="APS-C Cameras">APS-C Cameras</option>
          <option value="Micro Four Thirds Cameras">Micro Four Thirds Cameras</option>
          <option value="Medium Format Cameras">Medium Format Cameras</option>
        </select>

        <select
          className="py-3 px-4 border rounded-lg w-full text-black"
          value={primaryUseCase}
          onChange={(e) => setPrimaryUseCase(e.target.value)}
        >
          <option value="">Select Primary Use Case</option>
          <option value="Photography">Photography</option>
          <option value="Videography">Videography</option>
          <option value="Vlogging Cameras">Vlogging Cameras</option>
          <option value="Professional Cameras">Professional Cameras</option>
          <option value="Travel Cameras">Travel Cameras</option>
        </select>

        <div className="flex justify-between">
          <button className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 foucs:ring-pink-500 focus:ring-opacity-50">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 foucs:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
