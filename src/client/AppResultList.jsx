import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import ReactListView from 'react-list-view';
import { InfiniteLoader, AutoSizer, VirtualScroll } from 'react-virtualized';
import 'react-virtualized/styles.css';

import AppResult from './AppResult';

import styles from './AppResultList.css';

class AppResultList extends Component {

  constructor() {
    super();

    this.scrollTimeout = null;
    this.state = {
      rowHeight: 10,
      scrolling: false,
    };
    this.updateRowHeight = this.updateRowHeight.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.isRowLoaded = this.isRowLoaded.bind(this);
    this.loadMoreRows = this.loadMoreRows.bind(this);
  }

  updateRowHeight(component) {
    if (component === null) {
      return;
    }
    const element = ReactDOM.findDOMNode(component);
    if (element.clientHeight !== this.state.rowHeight) {
      this.setState({
        rowHeight: ReactDOM.findDOMNode(element).clientHeight,
      });
    }
  }

  handleScroll() {
    if (!this.state.scrolling) {
      this.setState({
        scrolling: true,
      });
    } else {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => this.setState({ scrolling: false }), 100);
  }

  isRowLoaded(idx) {
    return !!this.props.apps[idx];
  }

  loadMoreRows({ startIndex, stopIndex }) {
    this.props.onRequestRange([startIndex, stopIndex]);
  }

  renderRow(idx) {
    const { apps } = this.props;
    const app = apps[idx];
    let item;
    let loading;
    if (app) {
      loading = false;
      item = (
        <AppResult
          ref={this.updateRowHeight}
          className={styles.appResult}
          app={app}
        />
      );
    } else {
      loading = true;
      item = 'Loading...';
    }
    return (
      <div
        className={cx(styles.item, loading && styles.loading)}
        style={{
          height: this.state.rowHeight,
        }}
      >
        {item}
      </div>
    );
  }

  render() {
    const { appsCount, className } = this.props;
    const { rowHeight } = this.state;
    return (
      <div
        className={cx(styles.list, className)}
      >
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowsCount={appsCount}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ height, width }) => (
                <VirtualScroll
                  ref={registerChild}
                  width={width}
                  height={height}
                  rowHeight={rowHeight}
                  rowsCount={appsCount}
                  rowRenderer={this.renderRow}
                  onRowsRendered={onRowsRendered}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
      /*<ReactListView
        className={cx(styles.list, className)}
        rowHeight={this.state.rowHeight}
        rowCount={appsCount}
        onScroll={this.handleScroll}
        renderItem={(x, y, style) => {
          const app = apps[y];
          let item;
          let loading;
          if (app) {
            loading = false;
            item = (
              <AppResult
                ref={this.updateRowHeight}
                className={styles.appResult}
                app={app}
              />
            );
          } else {
            loading = true;
            item = 'Loading...';
            this.props.onRequestApp(y);
          }
          return (
            <div
              className={cx(styles.item, scrolling && styles.scrolling, loading && styles.loading)}
              style={{
                ...style,
                height: this.state.rowHeight,
              }}
            >
              {item}
            </div>
          );
        }}
      />*/
    );
  }

}

AppResultList.propTypes = {
  className: PropTypes.string,
  apps: PropTypes.object.isRequired,
  appsCount: PropTypes.number.isRequired,
  onRequestRange: PropTypes.func.isRequired,
  selectedApp: PropTypes.object,
};

export default AppResultList;
