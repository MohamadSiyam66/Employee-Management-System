import { useState } from "react";
import axios from "axios";
import BASE_URL from "../../api.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        joining_date: "",
        nda_file_path: "",
        uni_id_file_path: "",
        request_letter_file_path: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/candidate/upload`, form);
            toast.success("Documents submitted successfully!");
            setForm({
                name: "",
                email: "",
                phone: "",
                joining_date: "",
                nda_file_path: "",
                uni_id_file_path: "",
                request_letter_file_path: "",
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-center">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <h2 className="text-2xl font-semibold text-green-700">Thank you! 🎉</h2>
                <p className="mt-4 text-gray-600">Your documents have been submitted successfully.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <h2 className="text-2xl font-semibold mb-6 text-center">Candidate Onboading Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                        className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required
                        className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Joining Date</label>
                    <input name="joining_date" type="date" value={form.joining_date} onChange={handleChange}
                        className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label>Signed NDA Link</label>
                    <input name="nda_file_path" type="url" value={form.nda_file_path} onChange={handleChange}
                        className="w-full border p-2 rounded" placeholder="https://drive.google.com/..." required />
                </div>
                <div>
                    <label>University ID Link</label>
                    <input name="uni_id_file_path" type="url" value={form.uni_id_file_path} onChange={handleChange}
                        className="w-full border p-2 rounded" placeholder="https://drive.google.com/..." required />
                </div>
                <div>
                    <label>Internship Request Letter Link</label>
                    <input name="request_letter_file_path" type="url" value={form.request_letter_file_path} onChange={handleChange}
                        className="w-full border p-2 rounded" placeholder="https://drive.google.com/..." required />
                </div>
                <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded w-full">
                    Submit Documents
                </button>
            </form>
        </div>
    );
};

export default UploadPage;
