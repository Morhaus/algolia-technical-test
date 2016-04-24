import React, { PropTypes } from 'react';
import cx from 'classnames';

import Category from './Category';

import styles from './AppResult.css';

/* eslint-disable react/prefer-stateless-function */
// We need AppResult to support refs, so we can't use a stateless component.
class AppResult extends React.Component {
  render() {
    const { className, app, ...otherProps } = this.props;

    return (
      <a
        {...otherProps}
        href={app.link}
        className={cx(styles.container, className)}
      >
        <img alt="Icon" src={app.image} className={styles.image} />
        <span className={styles.name}>{app.name}</span>
        <Category
          className={styles.category}
          name={app.category}
        />
      </a>
    );
  }
}

AppResult.propTypes = {
  className: PropTypes.string,
  app: PropTypes.object.isRequired,
};

export default AppResult;
