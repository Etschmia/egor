import { useState, type ReactNode } from 'react';

interface PropertyGroupProps {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export default function PropertyGroup({
  title,
  defaultExpanded = false,
  children,
}: PropertyGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`property-group ${expanded ? 'property-group--expanded' : ''}`}>
      <button
        className="property-group__header"
        onClick={handleToggle}
        aria-expanded={expanded}
        aria-controls={`property-group-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="property-group__title">{title}</span>
        <span className="property-group__arrow">
          {expanded ? '▼' : '▶'}
        </span>
      </button>
      {expanded && (
        <div
          className="property-group__content"
          id={`property-group-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
