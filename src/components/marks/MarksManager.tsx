import React, { useState, useEffect } from 'react';
import "./MarksManager.css"
import { table } from 'console';

interface Mark {
    ID: number;
    DOCUMENT_ID: number;
    SEARCH_: string;
    PAGE: number;
    CREATED: string;
}

const MarksManager: React.FC = () => {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [document_id, setdocumentId] = useState(0);
    const [search_, setSearch_] = useState('');
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = 'http://10.42.0.243:4000/api';

    // Fetch all Marks on component mount
    useEffect(() => {
        fetchMarks();
    }, []);


    const fetchMarks = async () => {
        try {
            const response = await fetch(`${apiUrl}/marks`);
            const data: Mark[] = await response.json();
            setMarks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch Marks');
        }
    };

    const handleCreate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!document_id || !search_ || !page) {
            setError('documentId, search_ and page are required');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/marks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document_id, search_, page }),
            });
            if (response.ok) {
                setdocumentId(0);
                setSearch_('');
                setPage(0);

                fetchMarks();
                setError(null);
            } else {
                setError('Failed to create mark');
            }
        } catch (err) {
            setError('Error creating mark');
        }
    };

    const handleSearch = async () => {
        if (!search) {
            fetchMarks();
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/marks/filter/${encodeURIComponent(search)}`);
            const data: Mark[] = await response.json();
            setMarks(data);
            setError(null);
        } catch (err) {
            setError('Error searching Marks');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/marks/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchMarks();
                setError(null);
            } else {
                setError('Failed to delete document');
            }
        } catch (err) {
            setError('Error deleting document');
        }
    };

    return (
        <div className="marks-manager">
            <h1 className="marks-manager__title">Marks Manager</h1>

            {/* Create Document Form */}
            <div className="marks-manager__section">
                <h2 className="marks-manager__section-title">Create Mark</h2>
                <div className="marks-manager__form">
                    <input
                        type="number"
                        placeholder="Document ID"
                        value={document_id}
                        onChange={(e) => setdocumentId(Number(e.target.value))}
                        className="marks-manager__input"
                    />
                    <input
                        type="text"
                        placeholder="Search term"
                        value={search_}
                        onChange={(e) => setSearch_(e.target.value)}
                        className="marks-manager__input"
                    />
                    <input
                        type="number"
                        placeholder="Page number"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        className="marks-manager__input"
                    />
                    <button
                        onClick={handleCreate}
                        className="marks-manager__button marks-manager__button--create"
                    >
                        Create Mark
                    </button>
                </div>
            </div>

            {/* Search Marks */}
            <div className="marks-manager__section">
                <h2 className="marks-manager__section-title">Search Marks</h2>
                <div className="marks-manager__search-container">
                    <input
                        type="text"
                        placeholder="Search Marks by Document ID..."
                        value={search}
                        onChange={(e) => setSearch(Number(e.target.value))}
                        className="marks-manager__input marks-manager__input--search"
                    />
                    <button
                        onClick={handleSearch}
                        className="marks-manager__button marks-manager__button--search"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="marks-manager__error">
                    {error}
                </div>
            )}

            {/* Marks List */}
            <div className="marks-manager__list">
                {marks.length === 0 ? (
                    <div className="marks-manager__empty-state">
                        <p className="marks-manager__empty-state-title">No Marks found</p>
                        <p className="marks-manager__empty-state-subtitle">Try creating a new mark or adjusting your search</p>
                    </div>
                ) : (
                    <table className="marks-manager__table">
                        <thead>
                            <tr>
                                <th>Document ID</th>
                                <th>Search Term</th>
                                <th>Page</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marks.map((doc) => (
                                <tr key={doc.ID}>
                                    <td>{doc.DOCUMENT_ID}</td>
                                    <td>{doc.SEARCH_}</td>
                                    <td>{doc.PAGE}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(doc.ID)}
                                            className="marks-manager__button marks-manager__button--delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MarksManager;