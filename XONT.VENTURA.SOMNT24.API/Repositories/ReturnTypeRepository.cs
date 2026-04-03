using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using XONT.Common.Message;
using XONT.VENTURA.SOMNT24; 
using XONT.VENTURA.SOMNT24.API.Interfaces;
using XONT.VENTURA.SOMNT24.API.Models;

namespace XONT.VENTURA.SOMNT24.API.Repositories
{
    public class ReturnTypeRepository : IReturnTypeManager
    {
        private readonly string _connectionString;

        public ReturnTypeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("UserDB") 
                                ?? throw new ArgumentNullException("Connection string 'UserDB' not found in appsettings.json.");
        }

        // Helper to create and open connection
        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        // 1. Select Return Type (Maps automatically to the ReturnType Class)
        public ReturnType? SeletedReturnType(string businessUnit, string moduleCode, string returnType, ref MessageSet message)
        {
            using var connection = CreateConnection();
            var p = new { BusinessUnit = businessUnit, ModuleCode = moduleCode, ReturnType = returnType, ExecutionType = "6" };

            try
            {
                // Dapper's QueryFirstOrDefault handles the mapping and the loop for you.
                return connection.QueryFirstOrDefault<ReturnType>(
                    "[RD].[usp_SOMNT24GetAllData]", p, commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                message = MessageCreate.CreateErrorMessage(0, ex, "SeletedReturnType", "XONT.VENTURA.SOMNT24.API");
                return null;
            }
        }

        // 2. Update Return Type (Using DynamicParameters for explicit types)
        public void UpdateReturnType(string businessUnit, string userName, string executionType, ReturnType rtnType, ref MessageSet _msg, ref string update)
        {
            using var connection = CreateConnection();
            var p = new DynamicParameters();
            p.Add("@BusinessUnit", businessUnit);
            p.Add("@ModuleCode", rtnType.ModuleCode?.Trim());
            p.Add("@ReturnType", rtnType.RetnType?.Trim());
            p.Add("@Description", rtnType.Description?.Trim());
            p.Add("@ReturnCategory", rtnType.ReturnCategory?.Trim());
            p.Add("@ProcessingRequired", rtnType.ProcessingRequired?.Trim());
            p.Add("@Status", rtnType.Status?.Trim());
            p.Add("@CreatedBy", userName);
            p.Add("@LastUpdatedBy", userName);
            p.Add("@ExecutionType", executionType);
            p.Add("@TimeStamp", rtnType.TimeStamp, DbType.Binary); // Explicitly set for concurrency
            p.Add("@ReturnDeductionType", rtnType.ReturnDeductionType);
            p.Add("@ValidateReturnValue", rtnType.ValidateReturnValue?.Trim());

            try
            {
                // Execute returns the number of rows affected
                int rowsAffected = connection.Execute("RD.usp_SOMNT24UpdateReturnType", p, commandType: CommandType.StoredProcedure);
                update = rowsAffected > 0 ? "1" : "0";
            }
            catch (Exception ex)
            {
                _msg = MessageCreate.CreateErrorMessage(0, ex, "UpdateReturnType", "XONT.VENTURA.SOMNT24.API");
                update = "0";
            }
        }

        // 3. Get Grid Data (Returning DataTable for Legacy Interface Support)
        public DataTable GetGridData(Selection selected, out int rowCount, ref MessageSet msg)
        {
            rowCount = 0;
            var dt = new DataTable();
            using var connection = CreateConnection();

            var p = new DynamicParameters();
            p.Add("@BusinessUnit", selected.BusinessUnit);
            p.Add("@ReturnType", selected.RetnType);
            p.Add("@Description", selected.Description);
            p.Add("@ModuleCode", selected.ModuleCode);
            p.Add("@FirstRow", selected.FirstRow);
            p.Add("@LastRow", selected.LastRow);
            p.Add("@Status", selected.Status ? 1 : 0);
            p.Add("@ExecutionType", "2");

            try
            {
                // Fill DataTable using Dapper's ExecuteReader
                using (var reader = connection.ExecuteReader("[RD].[usp_SOMNT24GetAllData]", p, commandType: CommandType.StoredProcedure))
                {
                    dt.Load(reader);
                }

                // Get Row Count using ExecuteScalar (much faster than filling a table)
                p.Add("@ExecutionType", "3");
                rowCount = connection.ExecuteScalar<int>("[RD].[usp_SOMNT24GetAllData]", p, commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                msg = MessageCreate.CreateErrorMessage(0, ex, "GetGridData", "XONT.VENTURA.SOMNT24.API");
            }
            return dt;
        }

        // 4. Prompt Data & Exist Checks
        public DataTable ExistTransactionBLL(string businessUnit, string ExistReturn, ref MessageSet message) =>
            ExecuteSimpleDataTable(businessUnit, "7", message, "ExistTransactionBLL", ExistReturn);

        public DataTable GetModulePromptData(string businessUnit, ref MessageSet message) =>
            ExecuteSimpleDataTable(businessUnit, "1", message, "GetModulePromptData");

        public DataTable GetModulePromptDataForNew(string businessUnit, ref MessageSet message) =>
            ExecuteSimpleDataTable(businessUnit, "4", message, "GetModulePromptDataForNew");

        public DataTable GetCategoryPromptData(string businessUnit, ref MessageSet message) =>
            ExecuteSimpleDataTable(businessUnit, "5", message, "GetCategoryPromptData");

        // Common Helper for DataTable results
        private DataTable ExecuteSimpleDataTable(string businessUnit, string execType, MessageSet msg, string methodName, string returnType = "")
        {
            var dt = new DataTable();
            using var connection = CreateConnection();
            try
            {
                var p = new { BusinessUnit = businessUnit, ExecutionType = execType, ReturnType = returnType };
                using var reader = connection.ExecuteReader("[RD].[usp_SOMNT24GetAllData]", p, commandType: CommandType.StoredProcedure);
                dt.Load(reader);
            }
            catch (Exception ex)
            {
                msg = MessageCreate.CreateErrorMessage(0, ex, methodName, "XONT.VENTURA.SOMNT24.API");
            }
            return dt;
        }
    }
}