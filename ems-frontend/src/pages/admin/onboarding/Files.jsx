import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api.js";
import { 
    FileText, 
    Image, 
    File, 
    Calendar, 
    Mail, 
    User, 
    Clock,
    ExternalLink
} from "lucide-react";

const Files = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/candidate/candidates`)
            .then((res) => setDocs(res.data))
            .catch((err) => console.error("Failed to fetch documents", err));
    }, []);

    // Function to render document link
    const renderDocumentLink = (filePath, title, iconType) => {
        if (!filePath) {
            return (
                <div className="flex items-center gap-2 text-gray-400">
                    {iconType === 'image' && <Image size={16} />}
                    {iconType === 'document' && <FileText size={16} />}
                    {iconType === 'file' && <File size={16} />}
                    <span>Not uploaded</span>
                </div>
            );
        }

        const getIcon = () => {
            switch (iconType) {
                case 'image':
                    return <Image size={16} />;
                case 'document':
                    return <FileText size={16} />;
                default:
                    return <File size={16} />;
            }
        };

        return (
            <a
                href={filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
            >
                <div className="p-1.5 bg-blue-100 rounded-md">
                    {getIcon()}
                </div>
                <span className="font-medium">{title}</span>
                <ExternalLink size={14} className="text-blue-600" />
            </a>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Onboarding Files</h1>

            {docs.length === 0 ? (
                <p className="text-gray-500 text-center">No documents uploaded yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {docs.map((doc) => (
                        <div key={doc.id} className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    {doc.name}
                                </h2>
                                <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                                    <div className="p-1 bg-gray-100 rounded-md">
                                        <Mail size={14} className="text-gray-600" />
                                    </div>
                                    {doc.email}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                    <div className="p-1 bg-orange-100 rounded-md">
                                        <Calendar size={14} className="text-orange-600" />
                                    </div>
                                    Joining Date: {new Date(doc.joiningDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    {renderDocumentLink(doc.ndaFilePath, 'View NDA', 'document')}
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    {renderDocumentLink(doc.uniIdFilePath, 'View University ID', 'image')}
                                </div>

                                <div className="border-l-4 border-purple-500 pl-4">
                                    {renderDocumentLink(doc.requestLetterFilePath, 'View Request Letter', 'document')}
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <div className="p-1 bg-gray-100 rounded-md">
                                        <Clock size={12} className="text-gray-500" />
                                    </div>
                                    Uploaded at: {new Date(doc.uploadedAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Files;