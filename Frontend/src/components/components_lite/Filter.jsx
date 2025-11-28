import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

const Filter = ({ filters, selectedFilters, onFilterChange, onClearFilters }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg text-gray-900">Filter Jobs</p>
        {Object.keys(selectedFilters).length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      
      <hr className="my-3" />
      
      {/* Active Filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, value]) => (
              <Badge 
                key={key} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {key}: {value}
                <button
                  onClick={() => onFilterChange(key, '')}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filters.map((filter, index) => (
          <div key={index} className="space-y-3">
            <h2 className="font-medium text-gray-900">{filter.filterType}</h2>
            <RadioGroup 
              value={selectedFilters[filter.filterType.toLowerCase()] || ''}
              onValueChange={(value) => onFilterChange(filter.filterType.toLowerCase(), value)}
            >
              <div className="space-y-2">
                {filter.array.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={item} id={`${filter.filterType}-${item}`} />
                    <Label 
                      htmlFor={`${filter.filterType}-${item}`} 
                      className="text-sm cursor-pointer font-normal"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;