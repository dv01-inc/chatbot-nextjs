export function getIamConnectionString() {
  if (process.env.SKIP_DB_CONNECT === '1') {
    return (
      process.env.POSTGRES_CONNECTION_STRING ||
      'postgresql://dummy:dummy@localhost:5432/dummy'
    );
  }

  const iamUser = process.env.POSTGRES_IAM_USER;
  const dbName = process.env.POSTGRES_DB || 'chatbot_db';
  const host = 'localhost';
  const port = '5432';

  if (!iamUser || !dbName) {
    throw new Error('Missing required env vars: POSTGRES_IAM_USER');
  }

  return `postgresql://${iamUser}@${host}:${port}/${dbName}`;
}

export function getConnectionString() {
  // If using Cloud SQL, use IAM connection
  if (process.env.USE_CLOUD_SQL === '1') {
    return getIamConnectionString();
  }

  // Otherwise, use regular POSTGRES_URL
  return process.env.POSTGRES_URL!;
}