"use client"

import { useState } from "react"
import { Shield, Book, Video, Code2, FileCode2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              AuthGuard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Book className="h-4 w-4" />
              <span className="text-sm font-medium">Documentation</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">C++ Integration Guide</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to integrate OxcyAuth into your C++ application
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 gap-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
              <TabsTrigger value="video">Video Guide</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>What is OxcyAuth?</CardTitle>
                  <CardDescription>
                    A powerful authentication system for C++ applications with hardware-based protection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    OxcyAuth provides enterprise-grade authentication for your C++ applications with features like:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Hardware ID (HWID) binding for device-specific licensing</li>
                    <li>Version control and forced updates</li>
                    <li>User validation and password authentication</li>
                    <li>Ban management (IP and HWID bans)</li>
                    <li>HWID reset requests</li>
                    <li>Session management and force logout</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Files Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <FileCode2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">auth.hpp</h3>
                        <p className="text-sm text-muted-foreground">Header file with class definitions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <FileCode2 className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">auth.cpp</h3>
                        <p className="text-sm text-muted-foreground">Implementation file with logic</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Step 1: Add Files to Project</CardTitle>
                  <CardDescription>Include auth.hpp and auth.cpp in your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Download the files from your dashboard and add them to your project directory.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <code className="text-sm">
                        YourProject/
                        <br />
                        ├── auth.hpp
                        <br />
                        ├── auth.cpp
                        <br />
                        └── main.cpp
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 2: Configure Credentials</CardTitle>
                  <CardDescription>Update auth.cpp with your dashboard credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Open auth.cpp and locate the constructor (around line 69-70):
                    </p>
                    <div className="bg-slate-900 p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            `OxcyAuth::OxcyAuth()\n{\n    hwid = generate_hwid();\n    app_name = "YourApp_NAME";\n    owner_id = "YOUR_OWNER_ID";\n    secret = "YOUR_SECRET_KEY";\n}`,
                            "constructor",
                          )
                        }
                      >
                        {copiedCode === "constructor" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="text-sm text-green-400 overflow-x-auto">
                        <code>{`OxcyAuth::OxcyAuth()
{
    hwid = generate_hwid();
    app_name = "YourApp_NAME";      // From dashboard
    owner_id = "YOUR_OWNER_ID";     // From dashboard
    secret = "YOUR_SECRET_KEY";     // From dashboard
}`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Step 3: Include Dependencies</CardTitle>
                  <CardDescription>Link required libraries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Make sure to link libcurl and Windows libraries:</p>
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <pre className="text-sm text-blue-400 overflow-x-auto">
                        <code>{`#pragma comment(lib, "Ws2_32.lib")
#pragma comment(lib, "Crypt32.lib")
#pragma comment(lib, "Secur32.lib")
#pragma comment(lib, "Normaliz.lib")
#pragma comment(lib, "Wldap32.lib")`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Main.cpp Setup</CardTitle>
                  <CardDescription>Initialize OxcyAuth in your main application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            `#include "auth.hpp"\n\nint main() {\n    OxcyAuth().init();\n    OxcyAuth().check_version();\n    OxcyAuth().login();\n    OxcyAuth().license();\n    \n    // Your application code here\n    \n    return 0;\n}`,
                            "main",
                          )
                        }
                      >
                        {copiedCode === "main" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="text-sm text-cyan-400 overflow-x-auto">
                        <code>{`#include "auth.hpp"

int main() {
    OxcyAuth().init();           // Initialize auth system
    OxcyAuth().check_version();  // Verify app version
    OxcyAuth().login();          // Log HWID
    OxcyAuth().license();        // Check license
    
    // Your application code here
    
    return 0;
}`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Button Implementation</CardTitle>
                  <CardDescription>Using ImGui for user authentication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Example login form with ImGui:</p>
                    <div className="bg-slate-900 p-4 rounded-lg relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            `ImGui::InputTextEx(texture::user_input, "Username",\n    "Enter your name", globals.username, 65,\n    ImVec2(290, 40), NULL, NULL, NULL);\n\nImGui::InputTextEx(texture::key_input, "Password",\n    "Enter your password", globals.password, 65,\n    ImVec2(290, 40), NULL, NULL, NULL);\n\nif (ImGui::Button("AUTHORIZATION", ImVec2(290, 40))) {\n    if (std::strlen(globals.username) == 0 || std::strlen(globals.password) == 0) {\n        // Show error: fields empty\n    }\n    else {\n        bool valid = OxcyAuth().validate_user(globals.username, globals.password);\n        if (valid) {\n            page = 2; // Go to main page\n        }\n        else {\n            // Show error: invalid credentials\n        }\n    }\n}`,
                            "login",
                          )
                        }
                      >
                        {copiedCode === "login" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <pre className="text-sm text-purple-400 overflow-x-auto">
                        <code>{`ImGui::InputTextEx(texture::user_input, "Username",
    "Enter your name", globals.username, 65,
    ImVec2(290, 40), NULL, NULL, NULL);

ImGui::InputTextEx(texture::key_input, "Password",
    "Enter your password", globals.password, 65,
    ImVec2(290, 40), NULL, NULL, NULL);

if (ImGui::Button("AUTHORIZATION", ImVec2(290, 40))) {
    if (std::strlen(globals.username) == 0 || 
        std::strlen(globals.password) == 0) {
        // Show error: fields empty
    }
    else {
        bool valid = OxcyAuth().validate_user(
            globals.username, 
            globals.password
        );
        if (valid) {
            page = 2; // Go to main page
        }
        else {
            // Show error: invalid credentials
        }
    }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Methods</CardTitle>
                  <CardDescription>All OxcyAuth class methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <code className="text-sm text-primary">init()</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Initialize the auth system and verify credentials
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <code className="text-sm text-primary">check_version()</code>
                      <p className="text-sm text-muted-foreground mt-1">Verify app version and check for updates</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <code className="text-sm text-primary">login()</code>
                      <p className="text-sm text-muted-foreground mt-1">Log the HWID to the server</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <code className="text-sm text-primary">license()</code>
                      <p className="text-sm text-muted-foreground mt-1">Check if device/IP is banned</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <code className="text-sm text-primary">validate_user(username, password)</code>
                      <p className="text-sm text-muted-foreground mt-1">Authenticate user credentials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Video Guide Tab */}
            <TabsContent value="video" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-destructive" />
                    Installation Video Tutorial
                  </CardTitle>
                  <CardDescription>Watch a complete walkthrough of the integration process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Video className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-semibold mb-2">Video Coming Soon</p>
                        <p className="text-sm text-muted-foreground">
                          A detailed installation guide will be available here
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Link
                      href="/dashboard"
                      className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Code2 className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">Download Files</h3>
                          <p className="text-sm text-muted-foreground">Get auth.cpp and auth.hpp from dashboard</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground group-hover:text-foreground transition-colors">→</div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
