import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllStations } from '../utils/routeFinder';

const StationAutocomplete = ({ label, value, onChange, placeholder, unavailableStations = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    const allStations = getAllStations();

    const filteredStations = allStations.filter(station =>
        station.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !unavailableStations.includes(station)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="form-group" ref={wrapperRef}>
            <label>{label}</label>
            <div className="autocomplete-wrapper">
                <div className="input-icon-wrapper">
                    <Search className="input-icon" size={18} />
                    <input
                        type="text"
                        className="select-input"
                        placeholder={placeholder}
                        value={isOpen ? searchTerm : value}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                            if (value && e.target.value !== value) onChange('');
                        }}
                        onClick={() => {
                            setIsOpen(true);
                            setSearchTerm('');
                        }}
                    />
                </div>

                {isOpen && (
                    <div className="autocomplete-dropdown">
                        {filteredStations.length > 0 ? (
                            filteredStations.map((station) => (
                                <div
                                    key={station}
                                    className="autocomplete-item"
                                    onClick={() => {
                                        onChange(station);
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                >
                                    {station}
                                </div>
                            ))
                        ) : (
                            <div className="autocomplete-item" style={{ color: 'var(--color-text-muted)', cursor: 'default' }}>
                                No stations found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationAutocomplete;
