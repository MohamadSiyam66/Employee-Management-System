import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_v9cefdu";
const TEMPLATE_ID = "template_a9522to";
const PUBLIC_KEY = "ftnfacJJ-ngfLJ2gG";

const Onboarding = () => {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", description: "", googleDriveLink: "", candidateUploadLink:""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                name: form.name,
                email: form.email,
                google_drive_link: form.googleDriveLink,
                candidate_upload_link: form.candidateUploadLink,
                description: form.description,
            }, PUBLIC_KEY);

            alert("Candidate submitted and email sent!");

        } catch (error) {
            console.error("Error during onboarding:", error);
            alert("Failed to submit candidate");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Employee Onboarding</h1>
            <div className="max-w-3xl mx-auto bg-white shadow p-6 mt-6 rounded-md">
                <h2 className="text-xl font-semibold mb-4">Candidate Onboarding</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange}
                            className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                            className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Google Drive Link</label>
                        <input type="url" name="googleDriveLink" value={form.googleDriveLink} onChange={handleChange}
                            className="w-full border p-2 rounded" placeholder="https://drive.google.com/..." />
                    </div>
                    <div>
                        <label>Candidate Upload Link</label>
                        <input type="url" name="candidateUploadLink" value={form.candidateUploadLink} onChange={handleChange}
                            className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                            className="w-full border p-2 rounded" rows="3"></textarea>
                    </div>
                    <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">
                        Send Onboarding Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;
