import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import './SearchForm.scss';

interface SearchFormProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onClear, isLoading = false }) => {
  const [query, setQuery] = useState<string>('');
  const [isClearActive, setIsClearActive] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
    setIsClearActive(true);
    setTimeout(() => setIsClearActive(false), 200);
  };

  return (
    <div className="search-form-wrapper">
      <div className="search-form-container">
        <Form onSubmit={handleSubmit} className="search-form">
          <InputGroup className="search-input-group">
            <Form.Control
              type="text"
              placeholder="Please enter an artist name."
              value={query}
              onChange={handleChange}
              className="search-input"
            />
            <Button 
              variant="primary" 
              type="submit" 
              disabled={!query.trim() || isLoading}
              className={`search-button ${query.trim() ? 'enabled' : ''}`}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="search-spinner"
                  />
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : (
                'Search'
              )}
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleClear}
              className={`clear-button ${isClearActive ? 'active' : ''}`}
            >
              Clear
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default SearchForm;