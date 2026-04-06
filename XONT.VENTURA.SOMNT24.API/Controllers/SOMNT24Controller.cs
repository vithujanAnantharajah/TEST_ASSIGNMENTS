using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using XONT.Common.Message;
using XONT.VENTURA.SOMNT24;
using XONT.VENTURA.SOMNT24.API.Interfaces; // Ensure this points to your interface
using XONT.Ventura.AppConsole;
using XONT.VENTURA.SOMNT24.API.Models;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json; // For the User object

namespace XONT.VENTURA.SOMNT24.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class SOMNT24Controller : ControllerBase
    {
        private readonly IReturnTypeManager _returnManager;
        private MessageSet? _message = null;

        // Dependency Injection: The runtime provides the repository here
        public SOMNT24Controller(IReturnTypeManager returnManager)
        {
            _returnManager = returnManager;
        }

        // POST api/SOMNT24/ListReturnTypeData
        [HttpPost("ListReturnTypeData")]
        public IActionResult ListReturnTypeData([FromBody] Selection selection)
        {
            try
            {
                var user = GetUser();
                if (user == null) return Unauthorized("Session Expired");

                selection.BusinessUnit = user.BusinessUnit?.ToString().Trim();
                
                int totalRow = 0;
                DataTable selectedData = _returnManager.GetGridData(selection, out totalRow, ref _message);

                if (_message != null) return StatusCode(500, _message);

                // .NET 8 handles anonymous objects and DataTables well in Ok()
                return Ok(new { data = selectedData, total = totalRow });
            }
            catch (Exception ex)
            {
                return HandleException(ex, "ListReturnTypeData");
            }
        }

        // GET api/SOMNT24/GetModulePromptData
        [HttpGet("GetModulePromptData")]
        public IActionResult GetModulePromptData()
        {
            try
            {
                var user = GetUser();
                if (user == null) return Unauthorized();

                DataTable dt = _returnManager.GetModulePromptData(user.BusinessUnit.ToString().Trim(), ref _message);

                if (_message != null) return StatusCode(500, _message);
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetModulePromptData");
            }
        }

        // GET api/SOMNT24/SeletedReturnType
        [HttpGet("SeletedReturnType")]
        public IActionResult SeletedReturnType(string moduleCode, string returnType)
        {
            try
            {
                var user = GetUser();
                if (user == null) return Unauthorized();

                ReturnType retnType = _returnManager.SeletedReturnType(user.BusinessUnit.ToString().Trim(), moduleCode, returnType, ref _message);

                if (_message != null) return StatusCode(500, _message);
                return Ok(retnType);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "SeletedReturnType");
            }
        }

        // POST api/SOMNT24/InsertReturnType
        [HttpPost("InsertReturnType")]
        public IActionResult InsertReturnType([FromBody] dynamic returnData)
        {
            try
            {
                var user = GetUser();
                if (user == null) return Unauthorized();

                string updateStatus = "0";
                var rtnType = MapToReturnType(returnData, user.BusinessUnit.ToString().Trim());

                string pageType = returnData.pageType?.ToString() ?? "";
                
                if (pageType == "new" || pageType == "newBasedOn")
                {
                    // Check existence before insert
                    var existing = _returnManager.SeletedReturnType(user.BusinessUnit.ToString().Trim(), rtnType.ModuleCode, rtnType.RetnType, ref _message);
                    
                    if (existing != null && !string.IsNullOrEmpty(existing.RetnType))
                    {
                        var msg = MessageCreate.CreateUserMessage(200011, "Return Type", "", "", "", "", "");
                        return StatusCode(409, msg); // 409 Conflict is more standard for existing data
                    }
                    
                    _returnManager.UpdateReturnType(user.BusinessUnit.ToString().Trim(), user.UserName.ToString().Trim(), "1", rtnType, ref _message, ref updateStatus);
                }
                else
                {
                    _returnManager.UpdateReturnType(user.BusinessUnit.ToString().Trim(), user.UserName.ToString().Trim(), "2", rtnType, ref _message, ref updateStatus);
                }

                if (_message != null) return StatusCode(500, _message);
                return Ok(new { success = updateStatus == "1" });
            }
            catch (Exception ex)
            {
                return HandleException(ex, "InsertReturnType");
            }
        }

        #region Helpers

        private ReturnType MapToReturnType(dynamic data, string businessUnit)
        {
            string tsString = data.TimeStamp?.ToString();
            return new ReturnType
            {
                BusinessUnit = businessUnit,
                ModuleCode = data.ModuleCode?.ToString().Trim(),
                RetnType = data.ReturnType?.ToString().Trim(),
                Description = data.Description?.ToString().Trim(),
                ReturnCategory = data.ReturnCategory?.ToString().Trim(),
                // Use safe parsing for the TimeStamp byte array
                TimeStamp = !string.IsNullOrEmpty(tsString) ? Convert.FromBase64String(tsString) : null,
                ProcessingRequired = (bool)(data.SalableReturn ?? false) ? "1" : "0",
                Status = (bool)(data.Active ?? false) ? "1" : "0",
                ReturnDeductionType = (bool)(data.DeductFromSales ?? false) ? "1" : "0",
                ValidateReturnValue = data.ReturnValueValidation?.ToString() == "No" ? "0" : 
                                     (data.ReturnValueValidation?.ToString() == "Mandatory" ? "1" : "2")
            };
        }

        private IActionResult HandleException(Exception ex, string methodName)
        {
            var msg = MessageCreate.CreateErrorMessage(0, ex, methodName, "XONT.VENTURA.SOMNT24.API");
            return StatusCode(500, msg);
        }

        private User? GetUser()
        {
            // 1. Try to get the real session (standard logic)
            string? userJson = HttpContext.Session.GetString("Main_LoginUser");
            
            if (!string.IsNullOrEmpty(userJson))
            {
                return JsonConvert.DeserializeObject<User>(userJson);
            }

            // 2. MOCK USER FOR DEVELOPMENT
            // This allows Swagger to pass the "if (user == null)" check 
            // and sends a valid BusinessUnit to your SQL queries.
            return new User 
            { 
                UserName = "ZYUser", 
                BusinessUnit = "LUCK", // Ensure this exists in your XONT tables
            };
        }
        #endregion
    }
}