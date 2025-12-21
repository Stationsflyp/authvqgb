#include "auth.hpp"
#include <iostream>
#include <cstring>

// ============================================
// ESTRUCTURA GLOBAL PARA ALMACENAR DATOS
// ============================================
struct GlobalData {
    // Login
    char username[65] = "";
    char password[65] = "";
    char license_key[65] = "";
    
    // Register
    char reg_username[65] = "";
    char reg_password[65] = "";
    char reg_password_confirm[65] = "";
    char reg_license[65] = "";
    
    // Estados
    char error_message[256] = "";
    bool show_error = false;
};

GlobalData globals;
int current_page = 0; // 0 = Login, 1 = Register, 2 = Dashboard

OxcyAuth g_auth;

// ============================================
// RENDERIZAR PÁGINA DE LOGIN
// ============================================
void RenderLoginPage() {
    ImGui::SetNextWindowSize(ImVec2(600, 400), ImGuiCond_FirstUseEver);
    ImGui::Begin("OXCYSHOP - LOGIN", nullptr, ImGuiWindowFlags_NoMove);
    
    ImGui::Text("Ingresa tus credenciales para acceder");
    ImGui::Separator();
    
    ImGui::InputTextEx("user_login", "Username",
        "Enter your username", globals.username, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_None, NULL, NULL);
    
    ImGui::InputTextEx("pass_login", "Password",
        "Enter your password", globals.password, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_Password, NULL, NULL);
    
    ImGui::InputTextEx("license_login", "License Key",
        "Enter license key", globals.license_key, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_None, NULL, NULL);
    
    // Mostrar mensaje de error si existe
    if (globals.show_error) {
        ImGui::TextColored(ImVec4(1, 0, 0, 1), globals.error_message);
    }
    
    ImGui::Spacing();
    
    if (ImGui::Button("AUTHORIZATION", ImVec2(290, 40))) {
        if (std::strlen(globals.username) == 0 ||
            std::strlen(globals.password) == 0 ||
            std::strlen(globals.license_key) == 0) {
            strcpy_s(globals.error_message, sizeof(globals.error_message), 
                "Error: Todos los campos son requeridos");
            globals.show_error = true;
        }
        else {
            OxcyAuth auth;
            bool valid = auth.register_with_license(
                globals.license_key, 
                globals.username, 
                globals.password
            );
            
            if (valid) {
                current_page = 2; // Ir a dashboard
                memset(globals.username, 0, sizeof(globals.username));
                memset(globals.password, 0, sizeof(globals.password));
                memset(globals.license_key, 0, sizeof(globals.license_key));
                globals.show_error = false;
            }
            else {
                strcpy_s(globals.error_message, sizeof(globals.error_message), 
                    "Error: Usuario, contraseña o licencia inválida");
                globals.show_error = true;
            }
        }
    }
    
    ImGui::SameLine();
    if (ImGui::Button("CREATE ACCOUNT", ImVec2(290, 40))) {
        current_page = 1; // Ir a register
        globals.show_error = false;
    }
    
    ImGui::End();
}

// ============================================
// RENDERIZAR PÁGINA DE REGISTRO
// ============================================
void RenderRegisterPage() {
    ImGui::SetNextWindowSize(ImVec2(600, 500), ImGuiCond_FirstUseEver);
    ImGui::Begin("OXCYSHOP - REGISTER", nullptr, ImGuiWindowFlags_NoMove);
    
    ImGui::Text("Crea una nueva cuenta");
    ImGui::Separator();
    
    ImGui::InputTextEx("user_reg", "Username",
        "Choose a username", globals.reg_username, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_None, NULL, NULL);
    
    ImGui::InputTextEx("pass_reg", "Password",
        "Create password (min 8 chars)", globals.reg_password, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_Password, NULL, NULL);
    
    ImGui::InputTextEx("pass_confirm", "Confirm Password",
        "Confirm password", globals.reg_password_confirm, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_Password, NULL, NULL);
    
    ImGui::InputTextEx("license_reg", "License Key",
        "Enter license key", globals.reg_license, 65,
        ImVec2(290, 40), ImGuiInputTextFlags_None, NULL, NULL);
    
    // Mostrar mensaje de error si existe
    if (globals.show_error) {
        ImGui::TextColored(ImVec4(1, 0, 0, 1), globals.error_message);
    }
    
    ImGui::Spacing();
    
    if (ImGui::Button("CREATE ACCOUNT", ImVec2(290, 40))) {
        if (std::strlen(globals.reg_username) == 0 ||
            std::strlen(globals.reg_password) == 0 ||
            std::strlen(globals.reg_password_confirm) == 0 ||
            std::strlen(globals.reg_license) == 0) {
            strcpy_s(globals.error_message, sizeof(globals.error_message), 
                "Error: Todos los campos son requeridos");
            globals.show_error = true;
        }
        else if (std::strcmp(globals.reg_password, globals.reg_password_confirm) != 0) {
            strcpy_s(globals.error_message, sizeof(globals.error_message), 
                "Error: Las contraseñas no coinciden");
            globals.show_error = true;
        }
        else if (std::strlen(globals.reg_password) < 8) {
            strcpy_s(globals.error_message, sizeof(globals.error_message), 
                "Error: La contraseña debe tener al menos 8 caracteres");
            globals.show_error = true;
        }
        else {
            OxcyAuth auth;
            bool registered = auth.register_with_license(
                globals.reg_license, 
                globals.reg_username, 
                globals.reg_password
            );
            
            if (registered) {
                strcpy_s(globals.error_message, sizeof(globals.error_message), 
                    "Exito: Cuenta creada. Volviendo a login...");
                globals.show_error = false;
                
                // Limpiar campos
                memset(globals.reg_username, 0, sizeof(globals.reg_username));
                memset(globals.reg_password, 0, sizeof(globals.reg_password));
                memset(globals.reg_password_confirm, 0, sizeof(globals.reg_password_confirm));
                memset(globals.reg_license, 0, sizeof(globals.reg_license));
                
                // Volver a login después de 2 segundos
                Sleep(2000);
                current_page = 0;
            }
            else {
                strcpy_s(globals.error_message, sizeof(globals.error_message), 
                    "Error: Usuario existente o licencia inválida");
                globals.show_error = true;
            }
        }
    }
    
    ImGui::SameLine();
    if (ImGui::Button("BACK TO LOGIN", ImVec2(290, 40))) {
        current_page = 0;
        globals.show_error = false;
        memset(globals.error_message, 0, sizeof(globals.error_message));
    }
    
    ImGui::End();
}

// ============================================
// RENDERIZAR PÁGINA DE DASHBOARD
// ============================================
void RenderDashboard() {
    ImGui::SetNextWindowSize(ImVec2(800, 600), ImGuiCond_FirstUseEver);
    ImGui::Begin("OXCYSHOP - DASHBOARD", nullptr, ImGuiWindowFlags_NoMove);
    
    ImGui::Text("Bienvenido a OxcyShop");
    ImGui::Separator();
    
    ImGui::Text("Usuario: %s", globals.username);
    ImGui::Text("Licencia: %s", globals.license_key);
    
    ImGui::Spacing();
    ImGui::Separator();
    ImGui::Text("Panel de Control");
    
    if (ImGui::Button("LOGOUT", ImVec2(150, 40))) {
        current_page = 0;
        memset(globals.username, 0, sizeof(globals.username));
        memset(globals.password, 0, sizeof(globals.password));
        memset(globals.license_key, 0, sizeof(globals.license_key));
        globals.show_error = false;
    }
    
    ImGui::End();
}

// ============================================
// LOOP PRINCIPAL
// ============================================
void RenderUI() {
    switch (current_page) {
        case 0:
            RenderLoginPage();
            break;
        case 1:
            RenderRegisterPage();
            break;
        case 2:
            RenderDashboard();
            break;
    }
}

// ============================================
// MAIN
// ============================================
int main()
{
    // Inicializar sistema de autenticación
    g_auth.init();
    
    // Verificar versión del cliente
    if (!g_auth.check_version()) {
        std::cerr << "Error: Versión del cliente incompatible" << std::endl;
        return 1;
    }
    
    std::cout << "Sistema de autenticación iniciado correctamente" << std::endl;
    
    // Loop principal de la aplicación
    // Aquí iría el loop de ImGui con RenderUI()
    // while (running) {
    //     RenderUI();
    // }
    
    return 0;
}
