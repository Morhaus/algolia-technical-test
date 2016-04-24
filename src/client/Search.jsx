import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import FaSliders from 'react-icons/lib/fa/sliders';

import CATEGORIES from '../categories';
import AppResultList from './AppResultList';
import Category from './Category';

import styles from './Search.css';

class Search extends Component {

  constructor() {
    super();

    this.state = {
      value: '',
      filtersActive: false,
    };
    this.search = debounce(this.search.bind(this), 200);
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.handleLowerRankChange = this.handleLowerRankChange.bind(this);
    this.handleUpperRankChange = this.handleUpperRankChange.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentWillUnmount() {
    this.search.cancel();
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
    this.search();
  }

  search() {
    this.props.onSearch(
      this.state.value,
      this.props.categories,
      this.props.rank
    );
  }

  toggleCategory(category) {
    const idx = this.props.categories.indexOf(category);
    const newCategories = this.props.categories.slice();
    if (idx !== -1) {
      newCategories.splice(idx, 1);
    } else {
      newCategories.push(category);
    }
    this.props.onSearch(
      this.state.value,
      newCategories,
      this.props.rank
    );
  }

  handleLowerRankChange(e) {
    this.props.onSearch(
      this.state.value,
      this.props.categories,
      [e.target.valueAsNumber, this.props.rank[1]]
    );
  }

  handleUpperRankChange(e) {
    this.props.onSearch(
      this.state.value,
      this.props.categories,
      [this.props.rank[0], e.target.valueAsNumber]
    );
  }

  toggleFilters() {
    this.setState(state => ({ filtersActive: !state.filtersActive }));
  }

  render() {
    const {
      results, resultsCount, categories, onRequestRange, rank, className,
      ...otherProps,
    } = this.props;
    const { value, filtersActive } = this.state;

    return (
      <div {...otherProps} className={cx(styles.container, className)}>
        <div className={styles.main}>
          <input
            className={styles.input}
            value={value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Search apps..."
          />
          <FaSliders
            className={cx(
              styles.toggleFilters,
              filtersActive && styles.filtersActive
            )}
            onClick={this.toggleFilters}
          />
        </div>
        <div className={styles.over}>
          {filtersActive &&
            <div className={cx(styles.popOut, styles.filters)}>
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
          }
          {value !== '' &&
            <div className={styles.popOut}>
              {
                results && resultsCount > 0 &&
                  <AppResultList
                    className={styles.appResultList}
                    apps={results}
                    appsCount={resultsCount}
                    onRequestRange={onRequestRange}
                  />
              }
              <div className={styles.resultsCount}>
                {resultsCount === 0 ?
                  'No results' :
                  `${resultsCount} result${resultsCount > 1 ? 's' : ''}`
                }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

}

Search.propTypes = {
  className: PropTypes.string,
  onRequestRange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resultsCount: PropTypes.number,
  results: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  rank: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Search;
