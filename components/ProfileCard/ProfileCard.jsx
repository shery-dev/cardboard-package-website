"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/Context';
import { DeleteSession } from '../DeleteSession';

const ProfileCard = ({ user }) => {
    const router = useRouter();
    const { setIsLogIn } = useAppContext();

    const handleLogout = async () => {
        await DeleteSession();
        setIsLogIn(false);
        router.push('/');
    };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        permanentAddress: user?.permanentAddress || '',
        nationality: user?.nationality || '',
        gender: user?.gender || '',
        country: user?.country || '',
        title: user?.title || 'Customer'
    });

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
                const data = await response.json();
                const countryList = data.data.map((country) => country.name).sort();
                setCountries(countryList);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
            permanentAddress: user?.permanentAddress || '',
            nationality: user?.nationality || '',
            gender: user?.gender || '',
            country: user?.country || '',
            title: user?.title || 'Customer'
        });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    return (
        <div className="px-4 py-20 w-full  flex justify-center">
            <div className="bg-white shadow-lg rounded-lg flex flex-col lg:flex-row w-full max-w-5xl">
                <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 flex flex-col items-center lg:w-1/3">
                    <div className="bg-white p-2 rounded-full">
                        <img 
                            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97" 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full"
                        />
                    </div>
                    <h2 className="mt-4 text-white text-2xl font-bold">{formData.name}</h2>
                    <p className="text-white text-lg">{formData.title}</p>
                </div>
                <div className="p-6 lg:w-2/3">
                    <h3 className="text-gray-800 text-xl font-bold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Phone Number:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Permanent Address:</label>
                            <input
                                type="text"
                                name="permanentAddress"
                                value={formData.permanentAddress}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Nationality:</label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Gender:</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Country:</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Country</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
