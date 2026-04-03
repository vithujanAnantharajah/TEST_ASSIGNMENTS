using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Serialization;
using XONT.Common.Data; // Ensure these namespaces exist in your .NET 8 BLL/Domain
using XONT.Ventura.AppConsole;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURATION (Replaces web.config <appSettings>) ---
var appSettings = builder.Configuration.GetSection("AppSettings");

// --- 2. SERVICES (Dependency Injection) ---
builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options => {
        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    });

// Enable Session (Replaces Global.asax Session_Start logic)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Enable CORS (Critical for Angular)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => 
        policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
});

var app = builder.Build();

// --- 3. MIDDLEWARE PIPELINE ---
if (app.Environment.IsDevelopment()) {
    app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAngular");
app.UseSession();

// Middleware to mock your "Session_Start" logic
app.Use(async (context, next) => {
    if (string.IsNullOrEmpty(context.Session.GetString("Main_UserName"))) {
        // Mocking your Global.asax session defaults
        context.Session.SetString("Theme", "Blue");
        context.Session.SetString("Main_UserName", "xontadmin");
        context.Session.SetString("Main_BusinessUnit", "LUCK");
        // Note: For complex objects like 'User', you must serialize them to JSON strings
    }
    await next();
});

app.MapControllers();

app.Run();