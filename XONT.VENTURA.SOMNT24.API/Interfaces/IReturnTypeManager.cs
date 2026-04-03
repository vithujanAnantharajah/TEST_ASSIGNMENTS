using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using XONT.Common.Message; 
using XONT.Common.Data;
using XONT.VENTURA.SOMNT24.API.Models; 

namespace XONT.VENTURA.SOMNT24.API.Interfaces
{
    public interface IReturnTypeManager
    {
        // 1. Select a specific Return Type Item 
        ReturnType SeletedReturnType(string businessUnit, string moduleCode, string returnType, ref MessageSet message);

        // 2. Update Return Type Data
        void UpdateReturnType(string businessUnit, string userName, string executionType, ReturnType rtnType, ref MessageSet _msg, ref string update);

        // 3. List Data for Grids (Handles Pagination)
        DataTable GetGridData(Selection selected, out int rowCount, ref MessageSet msg);

        // 4. Check if Data exists in the Database
        DataTable ExistTransactionBLL(string businessUnit, string ExistReturn, ref MessageSet message);

        // 5. Get Module Prompt Data (General List)
        DataTable GetModulePromptData(string businessUnit, ref MessageSet message);

        // 6. Get Module Prompt Data (Filtered for New/Edit modes)
        DataTable GetModulePromptDataForNew(string businessUnit, ref MessageSet message);

        // 7. Get Category Prompt Data
        DataTable GetCategoryPromptData(string businessUnit, ref MessageSet msg);
    }
}