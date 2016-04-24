import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import FaSliders from 'react-icons/lib/fa/sliders';

import AppResultList from './AppResultList';
import Filters from './Filters';

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
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentWillUnmount() {
    this.search.cancel();
  }

  search() {
    this.props.onSearch(
      this.state.value,
      this.props.categories,
      this.props.rank
    );
  }

  handleFiltersChange(categories, rank) {
    this.props.onSearch(
      this.state.value,
      categories,
      rank
    );
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
    this.search();
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
            <Filters
              className={styles.popOut}
              categories={categories}
              rank={rank}
              onChange={this.handleFiltersChange}
            />
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
