import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../api/product';
import ProductModal from './ProductModal';

function ProductTable() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalProduct, setModalProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    useEffect(() => {
        async function fetchData() {
            const response = await getAllProducts();
            setProducts(response.data);
        }
        fetchData().then(r => console.log(r));
    }, []);

    const handleSort = (column) => () => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };
    const getSortedProducts = (products) => {
        if (!sortColumn) return products;

        let sortedProducts = [...products];
        sortedProducts.sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return -1;
            if (a[sortColumn] > b[sortColumn]) return 1;
            return 0;
        });
        if (sortDirection === "desc") sortedProducts.reverse();
        return sortedProducts;
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'text-gray-800 bg-green-200';
            case 'delivered':
                return 'text-gray-800 bg-blue-200';
            case 'in-progress':
                return 'text-gray-800 bg-yellow-200';
            case 'out-of-stock':
                return 'text-gray-800 bg-gray-200';
            default:
                return 'text-gray-800 bg-pink-200';
        }
    };
    const filteredProducts = products.filter(product =>
        product.item_id.toString().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <div className="mb-4 flex justify-between">
                <input
                    className="border p-2 rounded"
                    placeholder="Search by ID or Name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setIsModalOpen(true);
                        setModalProduct(null);
                    }}
                >
                    Add Item
                </button>
            </div>

            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-3 border-b cursor-pointer"
                        onClick={handleSort('id')}
                    >
                        ID
                        {sortColumn === 'id' &&
                            <span className={sortDirection === 'asc' ? 'text-blue-500' : 'text-red-500'}>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        }
                    </th>
                    <th className="py-2 px-3 border-b cursor-pointer" onClick={handleSort('name')}
                    >
                        Name
                        {sortColumn === 'name' &&
                            <span className={sortDirection === 'asc' ? 'text-blue-500' : 'text-red-500'}>
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        }
                    </th>
                    <th className="py-2 px-3 border-b">Price</th>
                    <th className="py-2 px-3 border-b">Description</th>
                    <th className="py-2 px-3 border-b">Status</th>
                    <th className="py-2 px-3 border-b">Image</th>
                    <th className="py-2 px-3 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                {getSortedProducts(filteredProducts).map(product => (
                    <tr key={product.id}>
                        <td className="py-2 px-3 border-b text-center">{product.item_id}</td>
                        <td className="py-2 px-3 border-b text-center">{product.name}</td>
                        <td className="py-2 px-3 border-b text-center">${product.price}.00</td>
                        <td className="py-2 px-3 border-b text-center">{product.description}</td>
                        <td className="py-2 px-3 border-b text-center">
                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${getStatusClass(product.status)}`}>
                                {product.status}
                             </span>
                        </td>
                        <td className="py-2 px-3 border-b text-center">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded" />
                        </td>
                        <td className="py-2 px-3 border-b text-center">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setModalProduct(product);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={async () => {
                                    await deleteProduct(product.id);
                                    setProducts(products.filter(p => p.id !== product.id));
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isModalOpen && <ProductModal product={modalProduct} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
export default ProductTable;
