using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc; // Replaces System.Web.Http
using Microsoft.AspNetCore.Http;
using XONT.Common.Data;
using XONT.Common.Message;
using XONT.Ventura.AppConsole;
using XONT.Ventura.Common;
using XONT.Ventura.Common.ConvertDateTime;
// using XONT.Ventura.Common.Prompt;
using XONT.VENTURA.SOMNT24;
using Newtonsoft.Json;
using System.Text;
using XONT.VENTURA.V2UTL01;
using System.Net;

namespace XONT.VENTURA.SOMNT24
{
    [Route("api/[controller]")] // Modern routing
    [ApiController]
    public class SOMNT24Controller : ControllerBase // Inheriting from ControllerBase for .NET 8
    {
        private ReturnTypeManager returnManager = new ReturnTypeManager();
        private User? _user = null;
        private MessageSet? _message = null;
        private string? update = null;

        // POST api/SOMNT24/ListReturnTypeData
        [HttpPost("ListReturnTypeData")]
        public IActionResult ListReturnTypeData([FromBody] Selection selection)
        {
            try
            {
                _user = GetUser();
                if (_user == null) return Unauthorized("Session Expired");

                selection.BusinessUnit = _user.BusinessUnit?.ToString().Trim();
                
                int totalRow = 0;
                DataTable SelectedOrders = returnManager.GetGridData(selection, out totalRow, ref _message);

                if (_message != null)
                {
                    return StatusCode(500, _message);
                }

                return Ok(new object[] { SelectedOrders, totalRow });
            }
            catch (Exception ex)
            {
                return GetErrorMessageResponse(ex, "ListReturnTypeData");
            }
        }

        // GET api/SOMNT24/GetModulePromptData
        [HttpGet("GetModulePromptData")]
        public IActionResult GetModulePromptData()
        {
            try
            {
                _user = GetUser();
                if (_user == null) return Unauthorized();

                DataTable dt = returnManager.GetModulePromptData(_user.BusinessUnit.ToString().Trim(), ref _message);

                if (_message != null)
                {
                    return StatusCode(500, _message);
                }
                return Ok(dt);
            }
            catch (Exception ex)
            {
                return GetErrorMessageResponse(ex, "GetModulePromptData");
            }
        }

        // GET api/SOMNT24/SeletedReturnType
        [HttpGet("SeletedReturnType")]
        public IActionResult SeletedReturnType(string moduleCode, string returnType)
        {
            try
            {
                _user = GetUser();
                if (_user == null) return Unauthorized();

                ReturnType retnType = returnManager.SeletedReturnType(_user.BusinessUnit.ToString().Trim(), moduleCode, returnType, ref _message);

                if (_message != null)
                {
                    return StatusCode(500, _message);
                }

                return Ok(retnType);
            }
            catch (Exception ex)
            {
                return GetErrorMessageResponse(ex, "SeletedReturnType");
            }
        }

        // POST api/SOMNT24/InsertReturnType
        [HttpPost("InsertReturnType")]
        public IActionResult InsertReturnType([FromBody] dynamic returnData)
        {
            bool success = false;
            try
            {
                _user = GetUser();
                if (_user == null) return Unauthorized();

                ReturnType rtnType = new ReturnType();
                rtnType.BusinessUnit = _user.BusinessUnit.ToString().Trim();
                rtnType.ModuleCode = returnData.ModuleCode?.ToString().Trim();
                rtnType.RetnType = returnData.ReturnType?.ToString().Trim();
                rtnType.Description = returnData.Description?.ToString().Trim();
                rtnType.ReturnCategory = returnData.ReturnCategory?.ToString().Trim();
                
                // Handling JSON-serialized byte arrays
                rtnType.TimeStamp = JsonConvert.DeserializeObject<byte[]>(returnData.TimeStamp.ToString());

                rtnType.ProcessingRequired = (bool)returnData.SalableReturn ? "1" : "0";
                rtnType.Status = (bool)returnData.Active ? "1" : "0";
                rtnType.ReturnDeductionType = (bool)returnData.DeductFromSales ? "1" : "0";

                string validation = returnData.ReturnValueValidation.ToString();
                rtnType.ValidateReturnValue = validation == "No" ? "0" : (validation == "Mandatory" ? "1" : "2");

                string pageType = returnData.pageType.ToString();
                
                if (pageType == "new" || pageType == "newBasedOn")
                {
                    ReturnType availableRetType = returnManager.SeletedReturnType(_user.BusinessUnit.ToString().Trim(), rtnType.ModuleCode, rtnType.RetnType, ref _message);
                    if (availableRetType.RetnType != null)
                    {
                        MessageSet message = MessageCreate.CreateUserMessage(200011, "Return Type", "", "", "", "", "");
                        return StatusCode(500, message);
                    }
                    
                    returnManager.UpdateReturnType(_user.BusinessUnit.ToString().Trim(), _user.UserName.ToString().Trim(), "1", rtnType, ref _message, ref update);
                }
                else
                {
                    returnManager.UpdateReturnType(_user.BusinessUnit.ToString().Trim(), _user.UserName.ToString().Trim(), "2", rtnType, ref _message, ref update);
                }

                if (_message != null) return StatusCode(500, _message);
                
                return Ok(update == "1");
            }
            catch (Exception ex)
            {
                return GetErrorMessageResponse(ex, "InsertReturnType");
            }
        }

        #region Error Message Handling
        private IActionResult GetErrorMessageResponse(MessageSet msg)
        {
            return StatusCode(500, msg);
        }
        private IActionResult GetErrorMessageResponse(Exception ex, string methodName)
        {
            _message = MessageCreate.CreateErrorMessage(0, ex, methodName, "XONT.VENTURA.SOMNT24.WEB.dll");
            return GetErrorMessageResponse(_message);
        }
        #endregion

        #region Get User
        private User? GetUser()
        {
            // In .NET 8, Session is accessed via HttpContext.Session
            byte[]? userData = HttpContext.Session.Get("Main_LoginUser");
            if (userData == null) return null;
            
            // Note: You may need a helper to deserialize your User object from the session byte array
            // If you stored it as a string, use HttpContext.Session.GetString("Main_LoginUser")
            return _user; 
        }
        #endregion
    }
}