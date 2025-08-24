import React, { useState, useEffect } from 'react';
import "./DocumentManager.css"

interface Document {
    ID: number;
    TITLE: string;
    URL: string;
    CREATED: string;
}

const DocumentManager: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://10.42.0.243:4000/api';

    // Fetch all documents on component mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${apiUrl}/documents`);
            const data: Document[] = await response.json();
            setDocuments(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch documents');
        }
    };

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!title || !url) {
            setError('Title and URL are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url }),
            });
            if (response.ok) {
                setTitle('');
                setUrl('');
                fetchDocuments();
                setError(null);
            } else {
                setError('Failed to create document');
            }
        } catch (err) {
            setError('Error creating document');
        }
    };

    const handleSearch = async () => {
        if (!search) {
            fetchDocuments();
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/documents/filter/${encodeURIComponent(search)}`);
            const data: Document[] = await response.json();
            setDocuments(data);
            setError(null);
        } catch (err) {
            setError('Error searching documents');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/documents/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchDocuments();
                setError(null);
            } else {
                setError('Failed to delete document');
            }
        } catch (err) {
            setError('Error deleting document');
        }
    };

    return (
        <div className="document-manager">
            <h1 className="document-manager__title">Document Manager</h1>

            {/* Create Document Form */}
            <div className="document-manager__section">
                <h2 className="document-manager__section-title">Create Document</h2>
                <div className="document-manager__form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="document-manager__input"
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="document-manager__input"
                    />
                    <button
                        onClick={handleCreate}
                        className="document-manager__button document-manager__button--create"
                    >
                        Create Document
                    </button>
                </div>
            </div>

            {/* Search Documents */}
            <div className="document-manager__section">
                <h2 className="document-manager__section-title">Search Documents</h2>
                <div className="document-manager__search-container">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="document-manager__input document-manager__input--search"
                    />
                    <button
                        onClick={handleSearch}
                        className="document-manager__button document-manager__button--search"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="document-manager__error">
                    {error}
                </div>
            )}

            {/* Documents List */}
            <div className="document-manager__list">
                {documents.length === 0 ? (
                    <div className="document-manager__empty-state">
                        <p className="document-manager__empty-state-title">No documents found</p>
                        <p className="document-manager__empty-state-subtitle">Try creating a new document or adjusting your search</p>
                    </div>
                ) : (
                    <div className="document-manager__items">
                        {documents.map((doc) => (
                            <div
                                key={doc.ID}
                                className="document-manager__item"
                            >
                                <div className="document-manager__item-content">
                                    <ul>
                                        <li>Document ID: {doc.ID}</li>
                                        <li>
                                            <a
                                                href={doc.URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="document-manager__item-url"
                                            >
                                                <h3 className="document-manager__item-title">{doc.TITLE}</h3>
                                            </a>
                                        </li>
                                        <li>
                                            <p className="document-manager__item-date">
                                                Created: {new Date(doc.CREATED).toLocaleString()}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc.ID)}
                                    className="document-manager__button document-manager__button--delete"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentManager;