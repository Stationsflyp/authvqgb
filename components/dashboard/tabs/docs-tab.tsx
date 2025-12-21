"use client"

import { BookOpen, Download, Code2, Settings, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocsTabProps {
  session: {
    owner_id: string
    app_name: string
    secret: string
  }
  showMessage: (text: string, type: "success" | "error") => void
}

export function DocsTab({ session, showMessage }: DocsTabProps) {
  const downloadFiles = () => {
    showMessage("Download functionality coming soon", "success")
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-400" />
          Documentation & Setup Guide
        </h2>
        <Button
          onClick={downloadFiles}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white shadow-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Files
        </Button>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Overview</h3>
        <p className="text-slate-300 leading-relaxed">
          AuthGuard provides a secure authentication system for your C++ applications. Follow the steps below to
          integrate it into your Visual Studio project.
        </p>
      </div>

      {/* Step 1: Download Files */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Required Files
            </h3>
            <p className="text-slate-300 mb-4">Download the AuthGuard package which includes the following files:</p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm">auth.hpp</code> - Header file with
                authentication declarations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm">auth.cpp</code> - Implementation file with
                authentication logic
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm">main.cpp</code> - Example usage file
              </li>
            </ul>
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm font-medium">
                All files are pre-configured with your credentials automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Required Includes */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Required Include Files
            </h3>
            <p className="text-slate-300 mb-4">
              Add these includes to your project. These are necessary for the authentication system to work properly:
            </p>
            <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/50">
              <pre className="text-green-400 text-sm font-mono">
                {`#include "auth.hpp"
#include <Windows.h>
#include <curl/curl.h>
#include <sstream>
#include <iomanip>`}
              </pre>
            </div>
            <div className="mt-4 space-y-2 text-slate-300 text-sm">
              <p>
                <strong className="text-blue-400">auth.hpp</strong> - Contains the Auth class and authentication
                functions
              </p>
              <p>
                <strong className="text-blue-400">Windows.h</strong> - Required for Windows API functions and HWID
                generation
              </p>
              <p>
                <strong className="text-blue-400">curl/curl.h</strong> - Used for HTTP requests to the authentication
                server
              </p>
              <p>
                <strong className="text-blue-400">sstream & iomanip</strong> - String manipulation for JSON parsing and
                data formatting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Recommended vcpkg Setup */}
      <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/30 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Recommended: Use vcpkg for Easy Setup
        </h3>
        <p className="text-slate-300 mb-4">
          We highly recommend using <strong className="text-purple-400">vcpkg</strong> to manage dependencies and save
          time during setup:
        </p>
        <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/50 mb-4">
          <pre className="text-cyan-400 text-sm font-mono">{`vcpkg install curl:x64-windows`}</pre>
        </div>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>
            <strong className="text-purple-400">vcpkg</strong> automatically handles:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Library installation and configuration</li>
            <li>Include paths and linker settings</li>
            <li>Dependency management</li>
            <li>Cross-platform compatibility</li>
          </ul>
          <p className="mt-3">
            Visit{" "}
            <a
              href="https://vcpkg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              vcpkg.io
            </a>{" "}
            for installation instructions.
          </p>
        </div>
      </div>

      {/* Step 3: Visual Studio Configuration */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            3
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Visual Studio Linker Configuration
            </h3>
            <p className="text-slate-300 mb-4">
              Configure your Visual Studio project to include the required Windows libraries:
            </p>

            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 font-semibold mb-2">Method 1: Using #pragma in Code</p>
                <p className="text-slate-300 text-sm mb-3">Add these lines at the top of your auth.cpp file:</p>
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-700/50">
                  <pre className="text-green-400 text-sm font-mono">
                    {`#pragma comment(lib, "Ws2_32.lib")
#pragma comment(lib, "Crypt32.lib")
#pragma comment(lib, "Secur32.lib")
#pragma comment(lib, "Normaliz.lib")
#pragma comment(lib, "Wldap32.lib")`}
                  </pre>
                </div>
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-300 font-semibold mb-2">Method 2: Visual Studio Project Settings</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm">
                  <li>Right-click your project in Solution Explorer</li>
                  <li>
                    Select <strong className="text-blue-400">Properties</strong>
                  </li>
                  <li>
                    Navigate to <strong className="text-blue-400">Linker → Input</strong>
                  </li>
                  <li>
                    In <strong className="text-blue-400">Additional Dependencies</strong>, add:
                  </li>
                </ol>
                <div className="bg-slate-900/80 rounded-lg p-3 mt-3 border border-slate-700/50">
                  <pre className="text-green-400 text-sm font-mono">
                    {`Ws2_32.lib;Crypt32.lib;Secur32.lib;Normaliz.lib;Wldap32.lib`}
                  </pre>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-200 font-semibold mb-2">Library Descriptions:</p>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>
                    <strong className="text-blue-400">Ws2_32.lib</strong> - Windows Sockets API for network
                    communications
                  </li>
                  <li>
                    <strong className="text-blue-400">Crypt32.lib</strong> - Cryptography API for secure data handling
                  </li>
                  <li>
                    <strong className="text-blue-400">Secur32.lib</strong> - Security Support Provider Interface (SSPI)
                  </li>
                  <li>
                    <strong className="text-blue-400">Normaliz.lib</strong> - String normalization for Unicode support
                  </li>
                  <li>
                    <strong className="text-blue-400">Wldap32.lib</strong> - Lightweight Directory Access Protocol
                    (LDAP) support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Usage Example */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            4
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-400 mb-3">Basic Usage Example</h3>
            <p className="text-slate-300 mb-4">Here's how to use the authentication system in your application:</p>
            <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-700/50">
              <pre className="text-blue-300 text-sm font-mono overflow-x-auto">
                {`Auth auth;

if (auth.login("username", "password")) {
    std::cout << "Login successful!" << std::endl;
    // Your application code here
} else {
    std::cout << "Login failed!" << std::endl;
    return 1;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 p-6 shadow-lg backdrop-blur-xl">
        <h3 className="text-xl font-bold text-blue-400 mb-2">Need Help?</h3>
        <p className="text-slate-300">
          If you encounter any issues during setup, check that all libraries are properly linked and that your Visual
          Studio is configured correctly. Make sure you're using the latest version of the files.
        </p>
      </div>
    </div>
  )
}
