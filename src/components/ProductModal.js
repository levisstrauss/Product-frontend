import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct, uploadImage } from '../api/product.js';

function ProductModal({ product, onClose }) {
    const [formData, setFormData] = useState({
        item_id: '',
        name: '',
        price: '',
        description: '',
        status: '',
        image: '',
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({...prevState, image: file}));
    };

    const handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (product) {
            // Logic for updating a product
            await handleUpdateProduct();
        } else {
            // Logic for adding a product
           await handleAddProduct();
        }
        onClose();
    };

    const handleAddProduct = async () => {
        const formUploadData = new FormData();
        const newProductData = {
            item_id: formData.item_id,
            name: formData.name,
            price: formData.price,
            description: formData.description,
            status: formData.status,
            image: formData.image,
        };
        const productCopy = { ...newProductData };
        delete productCopy.image;
        formUploadData.append("product", JSON.stringify(productCopy));
        formUploadData.append("image", newProductData.image);
        const imageResponse = await uploadImage(formUploadData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        await addProduct(imageResponse.data);
    }

    const handleUpdateProduct = async () => {
        const formUploadData = new FormData();
        const updatedProductData = {
            ...product,
            item_id: formData.item_id,
            name: formData.name,
            price: formData.price,
            description: formData.description,
            status: formData.status,
            image: formData.image,
        };
        console.log(updatedProductData);

        const productCopy = { ...updatedProductData };
        delete productCopy.image;
        formUploadData.append("product", JSON.stringify(productCopy));
        formUploadData.append("image", updatedProductData.image);
        const imageResponse = await uploadImage(formUploadData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        updateProduct(product.id, imageResponse.data);
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded p-6 w-1/3">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                    X
                </button>

                <h2 className="mb-4 text-center">{product ? 'Edit' : 'Add'} Product</h2>

                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-700 mb-2">Item Id:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Item ID"
                        value={formData.item_id}
                        onChange={e => setFormData({ ...formData, item_id: e.target.value })}
                    />
                    <label className="block text-gray-700 mb-2">Name:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <label className="block text-gray-700 mb-2">Price:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                    <label className="block text-gray-700 mb-2">Description:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <label className="block text-gray-700 mb-2">Status:</label>
                    <select
                        className="border p-2 mb-2 w-full"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                        <option value="available">Available</option>
                        <option value="delivered">Delivered</option>
                        <option value="in-progress">In Progress</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                    <label className="block text-gray-700 mb-2">Upload Image:</label>
                    <input
                        className="border p-2 mb-2 w-full"
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default ProductModal;
