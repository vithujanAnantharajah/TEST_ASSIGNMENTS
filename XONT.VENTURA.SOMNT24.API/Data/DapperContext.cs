using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace XONT.VENTURA.SOMNT24.API.Data
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Creates a connection based on the name provided (e.g., "UserDB", "SystemDB").
        /// Defaults to "UserDB" if no name is provided.
        /// </summary>
        public IDbConnection CreateConnection(string connectionName = "UserDB")
        {
            var connectionString = _configuration.GetConnectionString(connectionName);
            
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new ArgumentException($"Connection string '{connectionName}' not found in appsettings.json");
            }

            return new SqlConnection(connectionString);
        }
    }
}