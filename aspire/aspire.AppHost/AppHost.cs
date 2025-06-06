#pragma warning disable EXTEXP0018 // Type is for evaluation purposes only
#pragma warning disable ASPIREHOSTINGPYTHON001 // AddUvApp is experimental

var builder = DistributedApplication.CreateBuilder(args);

// Add the Python UV LLM Server using Community Toolkit
var llmServer = builder.AddUvApp("llm-server", "../../servers/llm-server", "-m", "src.main", "--host", "0.0.0.0", "--port", "8000")
    .WithHttpEndpoint(name: "http", port: 8000, env: "PORT")
    .WithEnvironment("PYTHONPATH", "src")
    .WithExternalHttpEndpoints();

// Add a node.js application that uses Dockerfile to be published
var frontend = builder.AddPnpmApp("frontend", workingDirectory: "../../app", scriptName: "dev")
    .WithNpmPackageInstallation()
    .WithHttpEndpoint(name: "http", port: 3000, env: "VITE_PORT", isProxied: false)
    .WithEnvironment("VITE_LLM_SERVER_URL", llmServer.GetEndpoint("http"))
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();