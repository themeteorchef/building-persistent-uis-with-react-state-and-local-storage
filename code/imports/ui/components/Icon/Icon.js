/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ icon, onClick }) => (<i onClick={onClick} className={`fa fa-${icon}`} />);

Icon.defaultProps = {
  onClick() {},
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Icon;
