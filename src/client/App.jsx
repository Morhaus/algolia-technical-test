import React, { Component } from 'react';
import algoliasearch from 'algoliasearch';
import clone from 'lodash/clone';
import debounce from 'lodash/debounce';
import async from 'async';

import CATEGORIES from '../categories';
import Search from './Search';
import styles from './App.css';

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

const HITS_PER_PAGE = 20;

class App extends Component {

  constructor() {
    super();

    this.loadedPages = [];
    this.loadingPages = [];
    this.state = {
      query: '',
      cachedResults: {},
      resultsCount: 0,
      categories: CATEGORIES,
      rank: [0, 100],
    };

    this.loadPages = debounce(this.loadPages.bind(this), 100);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRequestRange = this.handleRequestRange.bind(this);
  }

  componentWillUnmount() {
    this.loadPages.cancel();
  }

  handleSearch(query, categories, rank) {
    this.loadedPages = [];
    this.loadingPages = [];
    this.loadPages.cancel();

    if (query === '') {
      this.setState({
        query,
        categories,
        rank,
        cachedResults: {},
        resultsCount: 0,
      });
    } else {
      this.loadingPages.push(0);
      this.setState({
        query,
        categories,
        rank,
      }, this.loadPages);
    }
  }

  handleRequestRange([startIndex, stopIndex]) {
    const startPage = Math.floor(startIndex / HITS_PER_PAGE);
    const stopPage = Math.floor(stopIndex / HITS_PER_PAGE);
    for (let page = startPage; page <= stopPage; page++) {
      if (
        this.loadedPages.indexOf(page) !== -1 ||
        this.loadingPages.indexOf(page) !== -1
      ) {
        continue;
      }
      this.loadingPages.push(page);
    }
    if (this.loadingPages.length > 0) {
      this.loadPages();
    }
  }

  loadPages() {
    const { query, categories, rank } = this.state;
    const loadingPages = this.loadingPages;
    this.loadedPages = this.loadedPages.concat(loadingPages);
    this.loadingPages = [];
    async.mapLimit(
      loadingPages,
      4,
      (page, next) => {
        index.search(query, {
          page,
          numericFilters: `rank:${rank[0]} to ${rank[1]}`,
          facetFilters: `(${categories.map(c => `category:${c}`).join(',')})`,
        }, (err, result) => {
          if (err) {
            this.loadingPages.push(page);
            this.loadedPages.splice(this.loadedPages.indexOf(page), 1);
            next(null, { page, results: [] });
            return;
          }
          next(null, {
            page,
            resultsCount: result.nbHits,
            results: result.hits,
          });
        });
      },
      (err, pageResults) => {
        const cachedResults = clone(this.state.cachedResults);
        pageResults.forEach(({ page, results }) => {
          results.forEach((result, idx) => {
            cachedResults[page * HITS_PER_PAGE + idx] = result;
          });
        });
        this.setState({
          cachedResults,
          resultsCount: pageResults[0].resultsCount,
        });
      }
    );
  }

  render() {
    const { cachedResults, resultsCount, categories, rank } = this.state;
    return (
      <div className={styles.app}>
        <Search
          className={styles.search}
          onSearch={this.handleSearch}
          onRequestRange={this.handleRequestRange}
          results={cachedResults}
          resultsCount={resultsCount}
          categories={categories}
          rank={rank}
        />
      </div>
    );
  }

}

export default App;
