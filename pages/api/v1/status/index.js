import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const version = await database.query("SHOW server_version");

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: "SELECT COUNT(*)::int from pg_stat_activity where datname = $1;",
    values: [databaseName],
  });
  const databaseMaxConnections = await database.query("SHOW max_connections");
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version.rows[0].server_version,
        max_connections: parseInt(
          databaseMaxConnections.rows[0].max_connections,
        ),
        opened_connections: parseInt(databaseOpenedConnections.rows[0].count),
      },
    },
  });
}

export default status;
