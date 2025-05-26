var builder = DistributedApplication.CreateBuilder(args);

// add a node.js application that uses Dockerfile to be published
builder.AddPnpmApp("frontend", workingDirectory: "../../app", scriptName: "dev")
    .WithNpmPackageInstallation()
    .WithHttpEndpoint(name: "http", port: 3000, env: "VITE_PORT", isProxied: false)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();