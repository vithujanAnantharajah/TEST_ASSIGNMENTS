ALTER PROCEDURE [RD].[usp_SOMNT24GetAllData]
    @BusinessUnit        VARCHAR(4)  = '',
    @ModuleCode          VARCHAR(2)  = '',
    @ModuleCodeDesc      VARCHAR(40) = '',
    @ReturnType          VARCHAR(2)  = '',
    @Description         VARCHAR(40) = '',
    @ReturnCategory      VARCHAR(2)  = '',
    @ProcessingRequired  VARCHAR(1)  = '',
    @CreatedBy           VARCHAR(40) = '',
    @LastUpdatedBy       VARCHAR(40) = '',
    @Status              INT         = 0,
    @TimeStamp           TIMESTAMP   = NULL,
    @ExecutionType       CHAR(2)     = '',
    @ReturnDeductionType CHAR(1)     = '',
    @ValidateReturnValue CHAR(1)     = '',
    @FirstRow            INT         = 1,
    @LastRow             INT         = 100
AS
BEGIN
    SET NOCOUNT ON;

    IF (@ExecutionType IN ('1', '01', '4', '04'))
    BEGIN
        SELECT 
            Parameter AS [Module Code], 
            ParameterDescription AS [Description] 
        FROM XA.Parameter
        WHERE ParameterGroup = 'VRMODULE' 
          AND BusinessUnit = @BusinessUnit
          AND Status = 1;
        RETURN;
    END

    IF (@ExecutionType IN ('2', '02'))
    BEGIN
        SELECT 
            R.ModuleCode, 
            R.ReturnType, 
            R.[Description], 
            R.ReturnCategory, 
            R.ProcessingRequired, 
            R.[Status]
        FROM RD.ReturnType R
        INNER JOIN XA.Parameter P ON R.Businessunit = P.Businessunit 
            AND P.ParameterGroup = 'VRMODULE' 
            AND R.ModuleCode = P.Parameter
        WHERE R.Businessunit = @BusinessUnit
          AND (@ReturnType = '' OR R.ReturnType LIKE '%' + @ReturnType + '%')
          AND (@Description = '' OR R.[Description] LIKE '%' + @Description + '%')
          AND (@ModuleCode = '' OR R.ModuleCode LIKE '%' + @ModuleCode + '%')
          AND (@ModuleCodeDesc = '' OR P.ParameterDescription LIKE '%' + @ModuleCodeDesc + '%')
          AND (@Status = 0 OR R.Status = 1)
        ORDER BY R.ReturnType
        -- Modern Pagination (Faster than Subqueries)
        OFFSET (@FirstRow - 1) ROWS 
        FETCH NEXT (@LastRow - @FirstRow + 1) ROWS ONLY
        OPTION (RECOMPILE); -- Critical for varying search parameters
        RETURN;
    END

    IF (@ExecutionType IN ('3', '03'))
    BEGIN
        SELECT COUNT(1) AS TotalRows
        FROM RD.ReturnType R
        INNER JOIN XA.Parameter P ON R.Businessunit = P.Businessunit 
            AND P.ParameterGroup = 'VRMODULE' 
            AND R.ModuleCode = P.Parameter
        WHERE R.Businessunit = @BusinessUnit
          AND (@ReturnType = '' OR R.ReturnType LIKE '%' + @ReturnType + '%')
          AND (@Description = '' OR R.[Description] LIKE '%' + @Description + '%')
          AND (@ModuleCode = '' OR R.ModuleCode LIKE '%' + @ModuleCode + '%')
          AND (@ModuleCodeDesc = '' OR P.ParameterDescription LIKE '%' + @ModuleCodeDesc + '%')
          AND (@Status = 0 OR R.Status = 1)
        OPTION (RECOMPILE);
        RETURN;
    END

    IF (@ExecutionType IN ('5', '05'))
    BEGIN
        SELECT 
            LTRIM(Parameter) AS [Return Catagory], 
            ParameterDescription AS Description
        FROM XA.Parameter
        WHERE ParameterGroup = 'RETNCATG'
          AND BusinessUnit = @BusinessUnit
          AND Status = 1;
        RETURN;
    END

    IF (@ExecutionType IN ('6', '06'))
    BEGIN
        SELECT 
            R.ModuleCode, 
            R.ReturnType, 
            R.ReturnCategory, 
            R.[Description], 
            R.ProcessingRequired, 
            R.[Status], 
            R.[TimeStamp],
            P_Mod.ParameterDescription AS ModuleCodeDesc,
            P_Cat.ParameterDescription AS ReturnCategoryDesc,
            R.ReturnDeductionType, 
            R.ValidateReturnValue
        FROM RD.ReturnType R
        LEFT JOIN XA.Parameter P_Mod ON R.BusinessUnit = P_Mod.BusinessUnit 
            AND P_Mod.ParameterGroup = 'VRMODULE' 
            AND R.ModuleCode = P_Mod.Parameter
        LEFT JOIN XA.Parameter P_Cat ON R.BusinessUnit = P_Cat.BusinessUnit 
            AND P_Cat.ParameterGroup = 'RETNCATG' 
            AND R.ReturnCategory = P_Cat.Parameter
        WHERE R.BusinessUnit = @BusinessUnit 
          AND R.ModuleCode = @ModuleCode 
          AND R.ReturnType = @ReturnType;
        RETURN;
    END

    IF (@ExecutionType IN ('7', '07'))
    BEGIN
        SELECT TOP 1 ReturnType 
        FROM RD.CreditNoteLine 
        WHERE BusinessUnit = @BusinessUnit 
          AND ReturnType = @ReturnType;
        RETURN;
    END
END