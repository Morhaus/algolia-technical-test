import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import styles from './Category.css';

class Category extends Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.name);
  }

  render() {
    const { selected, name, className, ...otherProps } = this.props;
    return (
      <span
        {...otherProps}
        className={cx(
          styles.category,
          selected && styles.categorySelected,
          className
        )}
        onClick={this.props.onClick && this.handleClick}
      >
        {name}
      </span>
    );
  }

}

Category.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Category;
