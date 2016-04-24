const {
  ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_KEY,
  ALGOLIA_INDEX,
  ALGOLIA_SEARCH_KEY,
} = process.env;

if (
  !ALGOLIA_APP_ID ||
  !ALGOLIA_INDEX ||
  !ALGOLIA_ADMIN_KEY ||
  !ALGOLIA_SEARCH_KEY
) {
  throw new Error(
    'Please provide all the required environment variables. ' +
    'See the README for more information.'
  );
}
