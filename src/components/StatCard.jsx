import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable admin dashboard stat tile component.
 * Displays a number and label with a colorful icon background.
 * @param {object} props
 * @param {number|string} props.value - The statistic number to display.
 * @param {string} props.label - The descriptive label for the statistic.
 * @param {string} props.icon - The icon or emoji to display.
 * @param {'violet'|'indigo'|'emerald'|'amber'|'rose'|'sky'} [props.color='indigo'] - The color scheme for the icon background.
 * @returns {JSX.Element} A styled stat card element.
 */
export function StatCard({ value, label, icon, color = 'indigo' }) {
  const colorMap = {
    violet: 'bg-violet-100 text-violet-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    sky: 'bg-sky-100 text-sky-600',
  };

  const colorClasses = colorMap[color] || colorMap.indigo;

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-xl ${colorClasses}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['violet', 'indigo', 'emerald', 'amber', 'rose', 'sky']),
};

StatCard.defaultProps = {
  color: 'indigo',
};