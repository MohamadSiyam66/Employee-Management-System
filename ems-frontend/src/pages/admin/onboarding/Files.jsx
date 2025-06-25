import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../api.js";

const Files = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/candidate/candidates`) //  ${BASE_URL}/api/candidate/candidates
            .then((res) => setDocs(res.data))
            .catch((err) => console.error("Failed to fetch documents", err));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Onboarding Files</h1>

            {docs.length === 0 ? (
                <p className="text-gray-500 text-center">No documents uploaded yet.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {docs.map((doc) => (
                        <div key={doc.id} className="bg-white p-4 shadow rounded-md border border-gray-100">
                            <h2 className="text-lg font-semibold">{doc.name}</h2>
                            <p className="text-sm text-gray-600">{doc.email}</p>
                            <p className="text-sm text-gray-600">📞 {doc.phone}</p>
                            <p className="text-sm mt-1">🗓️ Joining Date: {doc.joiningDate}</p>

                            <div className="mt-3 space-y-2">
                                <div>
                                    📄 <span className="font-medium">NDA File:</span>{" "}
                                    {doc.ndaFilePath ? (
                                        <a
                                            href={doc.ndaFilePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Not uploaded</span>
                                    )}
                                </div>

                                <div>
                                    🪪 <span className="font-medium">University ID:</span>{" "}
                                    {doc.uniIdFilePath ? (
                                        <a
                                            href={doc.uniIdFilePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Not uploaded</span>
                                    )}
                                </div>

                                <div>
                                    📝 <span className="font-medium">Request Letter:</span>{" "}
                                    {doc.requestLetterFilePath ? (
                                        <a
                                            href={doc.requestLetterFilePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Not uploaded</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-3">🕒 Uploaded at: {new Date(doc.uploadedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Files;
