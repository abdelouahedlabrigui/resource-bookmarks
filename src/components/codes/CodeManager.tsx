import React, { useState, useEffect } from 'react';
import "./CodeManager.css"

interface Code {
    ID: number;
    TITLE: string;
    URL: string;
    CREATED: string;
}

const CodeManager: React.FC = () => {
    const [codes, setCodes] = useState<Code[]>([]);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://10.42.0.243:4000/api';

    // Fetch all Codes on component mount
    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            const response = await fetch(`${apiUrl}/codes`);
            const data: Code[] = await response.json();
            setCodes(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Codes');
        }
    };

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!title || !url) {
            setError('Title and URL are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/codes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, url }),
            });
            if (response.ok) {
                setTitle('');
                setUrl('');
                fetchCodes();
                setError(null);
            } else {
                setError('Failed to create Code');
            }
        } catch (err) {
            setError('Error creating Code');
        }
    };

    const handleSearch = async () => {
        if (!search) {
            fetchCodes();
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/codes/filter/${encodeURIComponent(search)}`);
            const data: Code[] = await response.json();
            setCodes(data);
            setError(null);
        } catch (err) {
            setError('Error searching Codes');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/codes/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCodes();
                setError(null);
            } else {
                setError('Failed to delete Code');
            }
        } catch (err) {
            setError('Error deleting Code');
        }
    };

    return (
        <div className="codes-manager">
            <h1 className="codes-manager__title">Code Manager</h1>

            {/* Create Code Form */}
            <div className="codes-manager__section">
                <h2 className="codes-manager__section-title">Create Code</h2>
                <div className="codes-manager__form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="codes-manager__input"
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="codes-manager__input"
                    />
                    <button
                        onClick={handleCreate}
                        className="codes-manager__button code-manager__button--create"
                    >
                        Create Code
                    </button>
                </div>
            </div>

            {/* Search Codes */}
            <div className="codes-manager__section">
                <h2 className="codes-manager__section-title">Search Codes</h2>
                <div className="codes-manager__search-container">
                    <input
                        type="text"
                        placeholder="Search Codes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="codes-manager__input Code-manager__input--search"
                    />
                    <button
                        onClick={handleSearch}
                        className="codes-manager__button Code-manager__button--search"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="codes-manager__error">
                    {error}
                </div>
            )}

            {/* Codes List */}
            <div className="codes-manager__list">
                {codes.length === 0 ? (
                    <div className="codes-manager__empty-state">
                        <p className="codes-manager__empty-state-title">No Codes found</p>
                        <p className="codes-manager__empty-state-subtitle">Try creating a new Code or adjusting your search</p>
                    </div>
                ) : (
                    <div className="codes-manager__items">
                        {codes.map((doc) => (
                            <div
                                key={doc.ID}
                                className="codes-manager__item"
                            >
                                <div className="codes-manager__item-content">
                                    <ul>
                                        <li>Code ID: {doc.ID}</li>
                                        <li>
                                            <a
                                                href={doc.URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="codes-manager__item-url"
                                            >
                                                <h3 className="codes-manager__item-title">{doc.TITLE}</h3>
                                            </a>
                                        </li>
                                        <li>
                                            <p className="codes-manager__item-date">
                                                Created: {new Date(doc.CREATED).toLocaleString()}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc.ID)}
                                    className="codes-manager__button Code-manager__button--delete"
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

export default CodeManager;