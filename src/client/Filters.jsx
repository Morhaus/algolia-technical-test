import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import CATEGORIES from '../categories';
import Category from './Category';

import styles from './Filters.css';

class Filters extends Component {

  constructor() {
    super();

    this.toggleCategory = this.toggleCategory.bind(this);
    this.handleLowerRankChange = this.handleLowerRankChange.bind(this);
    this.handleUpperRankChange = this.handleUpperRankChange.bind(this);
  }

  toggleCategory(category) {
    const idx = this.props.categories.indexOf(category);
    const newCategories = this.props.categories.slice();
    if (idx !== -1) {
      newCategories.splice(idx, 1);
    } else {
      newCategories.push(category);
    }
    this.props.onChange(
      newCategories,
      this.props.rank
    );
  }

  handleLowerRankChange(e) {
    this.props.onChange(
      this.props.categories,
      [e.target.valueAsNumber, this.props.rank[1]]
    );
  }

  handleUpperRankChange(e) {
    this.props.onChange(
      this.props.categories,
      [this.props.rank[0], e.target.valueAsNumber]
    );
  }

  render() {
    const { categories, rank, className } = this.props;

    return (
      <div className={cx(styles.filters, className)}>
        <div className={styles.rankFilter}>
          Rank between
          <input
            type="number"
            min={0}
            max={rank[1]}
            value={rank[0]}
            onChange={this.handleLowerRankChange}
          />
          and
          <input
            type="number"
            min={rank[0]}
            value={rank[1]}
            onChange={this.handleUpperRankChange}
          />
        </div>
        <div className={styles.categoryFilter}>
          <div className={styles.categoryList}>
            {CATEGORIES.map(c =>
              <Category
                key={c}
                className={styles.category}
                name={c}
                selected={categories.indexOf(c) !== -1}
                onClick={this.toggleCategory}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

}

Filters.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  rank: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Filters;
