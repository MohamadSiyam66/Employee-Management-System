import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import CustomTooltip from "../../../components/CustomTooltip";

const SERVICE_ID = "service_v9cefdu";
const TEMPLATE_ID = "template_a9522to";
const PUBLIC_KEY = "ftnfacJJ-ngfLJ2gG";

const Onboarding = () => {
    const [form, setForm] = useState({
        name: "", 
        email: "", 
        subject: "",
        description: "", 
        googleFormLink: "", 
        ndaDocumentLink: "",
    });
    const [loading, setLoading] = useState(false);
    const [tooltipStates, setTooltipStates] = useState({
        name: false,
        email: false,
        subject: false,
        googleFormLink: false,
        ndaDocumentLink: false,
        description: false
    });

    // Validation functions
    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        return nameRegex.test(name.trim());
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };
        
    const validateGoogleFormLink = (link) => {
        return link.trim().length > 0 && link.includes('docs.google.com/forms');
    };

    const validateNdaDocumentLink = (link) => {
        return link.trim().length > 0 && (link.includes('drive.google.com') || link.includes('docs.google.com'));
    };

    const validateForm = () => {
        const errors = {};

        if (!form.name.trim()) {
            errors.name = "Full name is required";
        } else if (!validateName(form.name)) {
            errors.name = "Full name should only contain letters and spaces";
        }

        if (!form.email.trim()) {
            errors.email = "Email is required";
        } else if (!validateEmail(form.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!form.subject.trim()) {
            errors.subject = "Subject is required";
        }

        if (!form.googleFormLink.trim()) {
            errors.googleFormLink = "Google Form link is required";
        } else if (!validateGoogleFormLink(form.googleFormLink)) {
            errors.googleFormLink = "Please enter a valid Google Form link";
        }

        if (!form.ndaDocumentLink.trim()) {
            errors.ndaDocumentLink = "NDA document link is required";
        } else if (!validateNdaDocumentLink(form.ndaDocumentLink)) {
            errors.ndaDocumentLink = "Please enter a valid Google Drive or Docs link";
        }

        if (!form.description.trim()) {
            errors.description = "Description is required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        
        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the validation errors before submitting.");
            return;
        }

        setLoading(true);

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                name: form.name,
                email: form.email,
                subject: form.subject,
                google_form_link: form.googleFormLink,
                nda_document_link: form.ndaDocumentLink,
                description: form.description,
            }, PUBLIC_KEY);

            toast.success("Candidate submitted successfully! Email notification sent.");
            
            // Reset form
            setForm({
                name: "", 
                email: "", 
                subject: "",
                phone: "", 
                description: "", 
                googleFormLink: "", 
                ndaDocumentLink: ""
            });

        } catch (error) {
            toast.error(`Error during onboarding: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for name field - prevent numbers and special characters
        if (name === 'name') {
            const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
            setForm({ ...form, [name]: filteredValue });
        } 
        // Special handling for phone field - allow only numbers for Sri Lanka mobile format
        else if (name === 'phone') {
            const filteredValue = value.replace(/[^0-9]/g, '');
            // Limit to maximum 10 digits
            const limitedValue = filteredValue.slice(0, 10);
            setForm({ ...form, [name]: limitedValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleBlur = (fieldName) => {
        const errors = validateForm();
        if (errors[fieldName]) {
            setTooltipStates(prev => ({
                ...prev,
                [fieldName]: true
            }));
        } else {
            setTooltipStates(prev => ({
                ...prev,
                [fieldName]: false
            }));
        }
    };

    const handleFocus = (fieldName) => {
        setTooltipStates(prev => ({
            ...prev,
            [fieldName]: false
        }));
    };

    const clearForm = () => {
        setForm({
            name: "", 
            email: "", 
            phone: "", 
            description: "", 
            googleFormLink: "", 
            ndaDocumentLink: ""
        });
        setTooltipStates({
            name: false,
            email: false,
            subject: false,
            googleFormLink: false,
            ndaDocumentLink: false,
            description: false
        });
    };

    const getValidationError = (fieldName) => {
        const errors = validateForm();
        return errors[fieldName] || "";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Onboarding</h1>
                            <p className="text-gray-600">Submit new candidate information for onboarding process</p>
                        </div>
                    </div>
                </div>

                {/* Onboarding Form */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Candidate Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Fill in the candidate details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <CustomTooltip 
                                    content={getValidationError('name')}
                                    isVisible={tooltipStates.name}
                                    position="top"
                                >
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                            onBlur={() => handleBlur('name')}
                                            onFocus={() => handleFocus('name')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter candidate's full name"
                                        required
                                    />
                                </div>
                                </CustomTooltip>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <CustomTooltip 
                                    content={getValidationError('email')}
                                    isVisible={tooltipStates.email}
                                    position="top"
                                >
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                            onBlur={() => handleBlur('email')}
                                            onFocus={() => handleFocus('email')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="candidate@example.com"
                                        required
                                    />
                                </div>
                                </CustomTooltip>
                            </div>  
                            {/* Subject */} 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <CustomTooltip 
                                    content={getValidationError('subject')}
                                    isVisible={tooltipStates.subject}
                                    position="top"
                                >
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                            onBlur={() => handleBlur('subject')}
                                            onFocus={() => handleFocus('subject')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Subject"
                                        required
                                    />
                                </div>
                                </CustomTooltip>
                            </div>
                            {/* Google Form Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Google Form Link *
                                </label>
                                <CustomTooltip 
                                    content={getValidationError('googleFormLink')}
                                    isVisible={tooltipStates.googleFormLink}
                                    position="top"
                                >
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <input
                                        type="url"
                                        name="googleFormLink"
                                        value={form.googleFormLink}
                                        onChange={handleChange}
                                            onBlur={() => handleBlur('googleFormLink')}
                                            onFocus={() => handleFocus('googleFormLink')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://docs.google.com/forms/...."
                                        required
                                    />
                                </div>
                                </CustomTooltip>
                            </div>
                        </div>

                        {/* NDA Document Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                NDA Document Link *
                            </label>
                            <CustomTooltip 
                                content={getValidationError('ndaDocumentLink')}
                                isVisible={tooltipStates.ndaDocumentLink}
                                position="top"
                            >
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <input
                                    type="url"
                                    name="ndaDocumentLink"
                                    value={form.ndaDocumentLink}
                                    onChange={handleChange}
                                        onBlur={() => handleBlur('ndaDocumentLink')}
                                        onFocus={() => handleFocus('ndaDocumentLink')}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://drive.google.com/file/..."
                                    required
                                />
                            </div>
                            </CustomTooltip>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <CustomTooltip 
                                content={getValidationError('description')}
                                isVisible={tooltipStates.description}
                                position="top"
                            >
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                    onBlur={() => handleBlur('description')}
                                    onFocus={() => handleFocus('description')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="4"
                                placeholder="Additional notes about the candidate, position, or requirements..."
                                required
                            ></textarea>
                            </CustomTooltip>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={clearForm}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Clear Form
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Onboarding Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Information Card */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-blue-900">Onboarding Process</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Once submitted, the email will be sent to the candidate for processing. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
