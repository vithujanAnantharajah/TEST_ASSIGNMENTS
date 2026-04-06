CREATE PROCEDURE [RD].[usp_SOMNT24UpdateReturnType]
    @BusinessUnit        CHAR(4)      = '',
    @ModuleCode          CHAR(2)      = '',
    @ReturnType          CHAR(2)      = '',
    @Description         VARCHAR(40)  = '',
    @ReturnCategory      CHAR(2)      = '',
    @ProcessingRequired  CHAR(1)      = '',
    @CreatedBy           VARCHAR(40)  = '',
    @LastUpdatedBy       VARCHAR(40)  = '',
    @Status              CHAR(1)      = '',
    @TimeStamp           VARBINARY(8) = NULL, 
    @ExecutionType       CHAR(1)      = '',
    @ReturnDeductionType CHAR(1)      = '',
    @ValidateReturnValue CHAR(1)      = ''
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; 

    BEGIN TRY
        BEGIN TRANSACTION;

        IF @ExecutionType = '1'
        BEGIN
            INSERT INTO [RD].[ReturnType] (
                [BusinessUnit], [ModuleCode], [ReturnType], [Description], 
                [ReturnCategory], [ProcessingRequired], [Status], 
                [CreatedOn], [CreatedBy], [LastUpdatedOn], [LastUpdatedBy], 
                [ReturnDeductionType], [ValidateReturnValue]
            )
            VALUES (
                TRIM(@BusinessUnit), TRIM(@ModuleCode), TRIM(@ReturnType), TRIM(@Description),
                TRIM(@ReturnCategory), @ProcessingRequired, @Status,
                GETDATE(), @CreatedBy, GETDATE(), @LastUpdatedBy,
                @ReturnDeductionType, @ValidateReturnValue
            );
        END

        ELSE IF @ExecutionType = '2'
        BEGIN
            UPDATE [RD].[ReturnType]
            SET [Description]         = TRIM(@Description),
                [ReturnCategory]      = TRIM(@ReturnCategory),
                [ProcessingRequired]  = @ProcessingRequired,
                [Status]              = @Status,
                [LastUpdatedOn]       = GETDATE(),
                [LastUpdatedBy]       = @LastUpdatedBy,
                [ReturnDeductionType] = @ReturnDeductionType,
                [ValidateReturnValue] = @ValidateReturnValue
            WHERE TRIM([BusinessUnit]) = TRIM(@BusinessUnit) 
              AND TRIM([ModuleCode])   = TRIM(@ModuleCode) 
              AND TRIM([ReturnType])   = TRIM(@ReturnType)
			  AND ([TimeStamp] = CAST(@TimeStamp AS VARBINARY(8)) OR @TimeStamp IS NULL);
            IF @@ROWCOUNT = 0
            BEGIN
                RAISERROR('Update failed: Record has been modified by another user or does not exist.', 16, 1);
            END
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
