'use client';
import React, { useEffect, useState, useRef } from 'react';
import Joi from 'joi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdd, useFindbyId, useUpdate } from '@/redux/api/product';
import withAuth from '@/components/withAuth';
import { Select,MenuItem } from '@mui/material';

const AddEditProduct = () => {
    const { push } = useRouter();
    const owner = localStorage.getItem('Id')
    const useSearch = useSearchParams();
    let Id = useSearch.get('Id');
    const [createPro] = useAdd();
    const [updatePro] = useUpdate();
    const [proData] = useFindbyId();
    const status = useRef(true)
    const [viewImg, setViewImg] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        proCode: '',
        image: null,
        price: '',
        category: '',
        manDate: '',
        ExpiryDate: '',
        Status: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status.current) {
            handleSetproData();
        }
        status.current = false
    }, [])

    const handleSetproData = async () => {
        if (Id) {
            const res = await proData({ id: Id })
            console.log('res', res)
            setFormData({
                name: res?.data?.user?.name,
                proCode: res?.data?.user?.productCode,
                image: res?.data?.user?.image,
                price: res?.data?.user?.price,
                category: res?.data?.user?.category,
                manDate: res?.data?.user?.manufactureDate,
                ExpiryDate: res?.data?.user?.expiryDate,
                Status: res?.data?.user?.status,
            })
        }
    }

    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        proCode: Joi.string().required().messages({
            'string.empty': 'Product code is required',
        }),
        image: Joi.any().optional(),
        price: Joi.number().required().messages({
            'number.base': 'Price must be a number',
            'number.empty': 'Price is required',
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Category is required',
        }),
        manDate: Joi.string().required().messages({
            'string.empty': 'Manufacturing date is required',
        }),
        ExpiryDate: Joi.string().required().messages({
            'string.empty': 'Expiry date is required',
        }),
        Status: Joi.string().required().messages({
            'string.empty': 'Status is required',
        }),
    });

    const validate = () => {
        const { error } = schema.validate(formData,
            { abortEarly: false });
        if (!error) return null;
        const newErrors = {};
        error.details.forEach((item) => {
            newErrors[item.path[0]] = item.message;
        });
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value,
        });
    };

    const handleChangeImage = async (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData, ['image']: file,
        });
        await setViewImg(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        const validationErrors = validate();
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {

            let newdata = new FormData();
            newdata.append('image', formData.image);
            newdata.append('name', formData.name);
            newdata.append('productCode', formData.proCode);
            newdata.append('price', formData.price);
            newdata.append('category', formData.category);
            newdata.append('manufactureDate', formData.manDate);
            newdata.append('expiryDate', formData.ExpiryDate);
            newdata.append('Status', formData.Status);
            newdata.append('owner', owner)
            if (Id) {
                newdata.append('id', Id);

            }
            let res;
            if (Id) {
                res = await updatePro({ ...newdata, 'owner': res?.data?.user?.owner })
            }
            else {
                res = await createPro(newdata);
            }
            if (res?.data) {
                alert(res?.data?.message);
                push('/product');
            } else {
                alert(res.error.data.message);
                push('/product');
            }
        } catch (error) {
            console.error('error', error);
        }
    };

    return (
        <div className="p-3">
            <div className="flex flex-col md:flex-row items-center justify-between p-2">
                <div className="font-bold text-2xl">{Id ? 'Edit ' : 'Add '}Product </div>
            </div>
            <div className="p-1">
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="name"
                            type="text"
                            placeholder="Name"
                            onChange={handleChange}
                            value={formData.name}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proCode">
                            Product Code
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="proCode"
                            type="text"
                            placeholder="Product Code"
                            onChange={handleChange}
                            value={formData.proCode}
                        />
                        {errors.proCode && <p className="text-red-500 text-sm">{errors.proCode}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            Price
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="price"
                            type="number"
                            placeholder="Price"
                            onChange={handleChange}
                            value={formData.price}
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                            Category
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="category"
                            type="text"
                            placeholder="Category"
                            onChange={handleChange}
                            value={formData.category}
                        />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manDate">
                            Manufacturing Date
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="manDate"
                            type="date"
                            onChange={handleChange}
                            value={formData.manDate}
                        />
                        {errors.manDate && <p className="text-red-500 text-sm">{errors.manDate}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ExpiryDate">
                            Expiry Date
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="ExpiryDate"
                            type="date"
                            onChange={handleChange}
                            value={formData.ExpiryDate}
                        />
                        {errors.ExpiryDate && <p className="text-red-500 text-sm">{errors.ExpiryDate}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Status">
                            Status
                        </label>
                        <Select
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Discontinued">Discontinued</MenuItem>
                        </Select>
                        {errors.Status && <p className="text-red-500 text-sm">{errors.Status}</p>}
                    </div> <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <input
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            name="image"
                            type="file"
                            onChange={(e) => handleChangeImage(e)}
                        />
                        {viewImg ?
                            <img src={viewImg} className='h-20 w-20' /> :
                            formData.image ?
                                <img src={formData.image} className='h-20 w-20' /> :
                                ''}
                    </div>

                </div>
            </div>
            <div className='text-center my-2'>
                <button type='button' onClick={handleSubmit} className="cursor-pointer bg-pink-700 text-center hover:bg-pink-400 text-white py-2 px-4 rounded">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default withAuth(AddEditProduct);
