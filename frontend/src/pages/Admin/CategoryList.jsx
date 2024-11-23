import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [cameraType, setCameraType] = useState("");
  const [sensorSize, setSensorSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [updatingCameraType, setUpdatingCameraType] = useState("");
  const [updatingSensorSize, setUpdatingSensorSize] = useState("");
  const [updatingPrimaryUseCase, setUpdatingPrimaryUseCase] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name || !cameraType || !sensorSize || !primaryUseCase) {
      toast.error("All fields are required");
      return;
    }

    try {
      const result = await createCategory({
        name,
        cameraType,
        sensorSize,
        primaryUseCase,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setCameraType("");
        setSensorSize("");
        setPrimaryUseCase("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName || !updatingCameraType || !updatingSensorSize || !updatingPrimaryUseCase) {
      toast.error("All fields are required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
          cameraType: updatingCameraType,
          sensorSize: updatingSensorSize,
          primaryUseCase: updatingPrimaryUseCase,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setUpdatingCameraType("");
        setUpdatingSensorSize("");
        setUpdatingPrimaryUseCase("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Tray again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E0E]">
      <AdminMenu />
      <div className="flex-1 pt-[90px] px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Manage Categories</h2>
          <CategoryForm
            value={name}
            setValue={setName}
            cameraType={cameraType}
            setCameraType={setCameraType}
            sensorSize={sensorSize}
            setSensorSize={setSensorSize}
            primaryUseCase={primaryUseCase}
            setPrimaryUseCase={setPrimaryUseCase}
            handleSubmit={handleCreateCategory}
          />
          <div className="my-8 border-t border-gray-700"></div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-transparent border border-pink-500 text-pink-500 py-2 px-4 rounded-lg hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                    setUpdatingCameraType(category.cameraType);
                    setUpdatingSensorSize(category.sensorSize);
                    setUpdatingPrimaryUseCase(category.primaryUseCase);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>

          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <CategoryForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              cameraType={updatingCameraType}
              setCameraType={(value) => setUpdatingCameraType(value)}
              sensorSize={updatingSensorSize}
              setSensorSize={(value) => setUpdatingSensorSize(value)}
              primaryUseCase={updatingPrimaryUseCase}
              setPrimaryUseCase={(value) => setUpdatingPrimaryUseCase(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
