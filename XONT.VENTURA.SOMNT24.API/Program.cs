using XONT.VENTURA.SOMNT24.API.Interfaces;
using XONT.VENTURA.SOMNT24.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(); // Required since your controller uses Newtonsoft for JSON/Byte arrays

// 2. Register Dependency Injection (DI)
// This tells .NET to provide ReturnTypeRepository whenever IReturnTypeManager is requested
builder.Services.AddScoped<IReturnTypeManager, ReturnTypeRepository>();

// 3. Configure Session Management
// Required for your GetUser() method in the controller
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set session timeout
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// 4. Configure CORS (Optional: Add this if your frontend is on a different port/domain)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 5. Add Swagger (Optional: Very helpful for testing your new API endpoints)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 7. Enable Session and CORS Middleware
app.UseCors("AllowAll");
app.UseSession(); 

app.UseAuthorization();

// Map attribute-routed controllers (like your [Route("api/[controller]")])
app.MapControllers();

app.Run();