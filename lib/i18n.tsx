"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

export type Language = "en" | "es" | "ru" | "hi" | "ar"

export const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.docs": "Docs",
    "nav.login": "Login",
    "nav.getStarted": "Get Started",

    // Hero
    "hero.badge": "Secure Authentication System",
    "hero.title": "Protect Your Application",
    "hero.subtitle": "With Military-Grade Security",
    "hero.description":
      "Advanced authentication system with HWID protection, real-time monitoring, and enterprise-level security.",
    "hero.free": "100% Free",
    "hero.private": "Private & Secure",
    "hero.getStarted": "Get Started",
    "hero.viewFeatures": "View Features",
    "hero.encryption": "End-to-End Encryption",
    "hero.hwid": "HWID Protection",
    "hero.analytics": "Real-time Analytics",

    // Features
    "features.title": "Everything You Need to Secure Your App",
    "features.subtitle": "Powerful features designed for developers who demand security and reliability.",
    "features.security": "Advanced Security",
    "features.securityDesc": "Military-grade encryption and HWID protection to secure your applications.",
    "features.users": "User Management",
    "features.usersDesc": "Comprehensive user dashboard with real-time session tracking and control.",
    "features.analytics": "Analytics Dashboard",
    "features.analyticsDesc": "Beautiful charts and statistics to monitor your application usage.",
    "features.licenses": "License Management",
    "features.licensesDesc": "Generate, manage, and track licenses with expiration dates and HWID binding.",
    "features.notifications": "Real-Time Notifications",
    "features.notificationsDesc": "Instant toast notifications for all critical events and actions.",
    "features.hwid": "HWID Reset System",
    "features.hwidDesc": "Automated hardware ID reset requests with approval workflow.",
    "features.deploy": "Instant Deployment",
    "features.deployDesc": "Deploy in minutes with our simple API integration and documentation.",
    "features.api": "API Routes",
    "features.apiDesc": "RESTful API endpoints for seamless integration with your applications.",

    // Stats
    "stats.users": "Active Users",
    "stats.uptime": "Uptime",
    "stats.apps": "Apps Protected",
    "stats.support": "Support",

    // CTA
    "cta.title": "Ready to Secure Your Application?",
    "cta.description": "Join thousands of developers who trust AuthGuard to protect their applications.",
    "cta.trial": "Login Now",
    "cta.docs": "View Documentation",

    // Dashboard
    "dashboard.title": "Control Panel",
    "dashboard.logout": "Logout",
    "dashboard.refresh": "Refresh",
    "dashboard.myCredentials": "My Credentials",
    "dashboard.users": "Users",
    "dashboard.killSession": "Kill Session",
    "dashboard.createUser": "Create User",
    "dashboard.banned": "Banned",
    "dashboard.hwidResets": "HWID Reset",
    "dashboard.version": "Version",
    "dashboard.installation": "Installation",
    "dashboard.documentation": "Documentation",
    "dashboard.licenses": "Licenses",
    "dashboard.contact": "Contact",

    // Credentials
    "creds.username": "Username",
    "creds.appName": "App Name",
    "creds.ownerId": "Owner ID",
    "creds.secret": "Secret",
    "creds.copy": "Copy",
    "creds.copied": "Copied",

    // Users
    "users.id": "ID",
    "users.username": "Username",
    "users.hwid": "HWID",
    "users.ip": "IP",
    "users.lastLogin": "Last Login",
    "users.status": "Status",
    "users.actions": "Actions",
    "users.delete": "Delete",
    "users.kill": "Kill",
    "users.banHW": "Ban HW",
    "users.banIP": "Ban IP",
    "users.changePass": "Password",
    "users.noUsers": "No users",

    // Create User
    "create.title": "Create User",
    "create.username": "Username",
    "create.password": "Password",
    "create.button": "Create",

    // Kill Session
    "kill.title": "Force Logout",
    "kill.username": "Username to kill",
    "kill.button": "Kill Session",
    "kill.warning": "Will block the user and close all open EXEs",

    // Banned
    "banned.title": "Hardware/IP Banned",
    "banned.type": "Type",
    "banned.value": "Value",
    "banned.reason": "Reason",
    "banned.date": "Date",
    "banned.unban": "Unban",
    "banned.noItems": "No banned items",

    // Version
    "version.title": "Client Version",
    "version.required": "Required Version",
    "version.current": "Current Version",
    "version.update": "Update",
    "version.warning": "Changing the required version will force all users to update",

    // Footer
    "footer.developer": "Developer by",
    "footer.instagram": "Instagram",
    "footer.discord": "Discord",

    // Login
    "login.title": "Control Panel",
    "login.button": "Enter with Discord",
    "login.soon": "Coming soon: Google, GitHub and more options",

    // Messages
    "msg.success": "Success",
    "msg.error": "Error",
    "msg.deleted": "Deleted",
    "msg.created": "Created",
    "msg.updated": "Updated",
    "msg.banned": "Banned",
    "msg.unbanned": "Unbanned",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.features": "Características",
    "nav.pricing": "Precios",
    "nav.docs": "Documentación",
    "nav.login": "Ingresar",
    "nav.getStarted": "Comenzar",

    // Hero
    "hero.badge": "Sistema de Autenticación Seguro",
    "hero.title": "Protege Tu Aplicación",
    "hero.subtitle": "Con Seguridad de Grado Militar",
    "hero.description":
      "Sistema de autenticación avanzado con protección HWID, monitoreo en tiempo real y seguridad de nivel empresarial.",
    "hero.free": "100% Gratuito",
    "hero.private": "Privado y Seguro",
    "hero.getStarted": "Comenzar",
    "hero.viewFeatures": "Ver Características",
    "hero.encryption": "Cifrado de Extremo a Extremo",
    "hero.hwid": "Protección HWID",
    "hero.analytics": "Análisis en Tiempo Real",

    // Features
    "features.title": "Todo lo que Necesitas para Asegurar Tu App",
    "features.subtitle":
      "Características poderosas diseñadas para desarrolladores que exigen seguridad y confiabilidad.",
    "features.security": "Seguridad Avanzada",
    "features.securityDesc": "Encriptación de nivel militar y protección HWID para asegurar tus aplicaciones.",
    "features.users": "Gestión de Usuarios",
    "features.usersDesc": "Panel completo con seguimiento y control de sesiones en tiempo real.",
    "features.analytics": "Panel de Análisis",
    "features.analyticsDesc": "Gráficos y estadísticas hermosos para monitorear el uso de tu aplicación.",
    "features.licenses": "Gestión de Licencias",
    "features.licensesDesc": "Genera, gestiona y rastrea licencias con fechas de vencimiento y vinculación HWID.",
    "features.notifications": "Notificaciones en Tiempo Real",
    "features.notificationsDesc": "Notificaciones instantáneas para todos los eventos y acciones críticas.",
    "features.hwid": "Sistema de Reset HWID",
    "features.hwidDesc": "Solicitudes automáticas de reset de ID de hardware con flujo de aprobación.",
    "features.deploy": "Despliegue Instantáneo",
    "features.deployDesc": "Despliega en minutos con nuestra integración API simple y documentación.",
    "features.api": "Rutas API",
    "features.apiDesc": "Endpoints RESTful API para integración perfecta con tus aplicaciones.",

    // Stats
    "stats.users": "Usuarios Activos",
    "stats.uptime": "Disponibilidad",
    "stats.apps": "Apps Protegidas",
    "stats.support": "Soporte",

    // CTA
    "cta.title": "¿Listo para Asegurar Tu Aplicación?",
    "cta.description": "Únete a miles de desarrolladores que confían en AuthGuard para proteger sus aplicaciones.",
    "cta.trial": "Ingresar Ahora",
    "cta.docs": "Ver Documentación",

    // Dashboard
    "dashboard.title": "Panel de Control",
    "dashboard.logout": "Salir",
    "dashboard.refresh": "Actualizar",
    "dashboard.myCredentials": "Mis Credenciales",
    "dashboard.users": "Usuarios",
    "dashboard.killSession": "Kill Sesión",
    "dashboard.createUser": "Crear Usuario",
    "dashboard.banned": "Baneados",
    "dashboard.hwidResets": "Reset HWID",
    "dashboard.version": "Versión",
    "dashboard.installation": "Instalación",
    "dashboard.documentation": "Documentación",
    "dashboard.licenses": "Licencias",
    "dashboard.contact": "Contacto",

    // Credentials
    "creds.username": "Usuario",
    "creds.appName": "Nombre App",
    "creds.ownerId": "Owner ID",
    "creds.secret": "Secret",
    "creds.copy": "Copiar",
    "creds.copied": "Copiado",

    // Users
    "users.id": "ID",
    "users.username": "Usuario",
    "users.hwid": "HWID",
    "users.ip": "IP",
    "users.lastLogin": "Último Login",
    "users.status": "Estado",
    "users.actions": "Acciones",
    "users.delete": "Eliminar",
    "users.kill": "Kill",
    "users.banHW": "Ban HW",
    "users.banIP": "Ban IP",
    "users.changePass": "Contraseña",
    "users.noUsers": "Sin usuarios",

    // Create User
    "create.title": "Crear Usuario",
    "create.username": "Usuario",
    "create.password": "Contraseña",
    "create.button": "Crear",

    // Kill Session
    "kill.title": "Forzar Cierre de Sesión",
    "kill.username": "Usuario a matar",
    "kill.button": "Matar Sesión",
    "kill.warning": "Bloqueará el usuario y cerrará todas sus EXE abiertas",

    // Banned
    "banned.title": "Hardware/IP Baneados",
    "banned.type": "Tipo",
    "banned.value": "Valor",
    "banned.reason": "Razón",
    "banned.date": "Fecha",
    "banned.unban": "Desbanear",
    "banned.noItems": "Sin items baneados",

    // Version
    "version.title": "Versión del Cliente",
    "version.required": "Versión Requerida",
    "version.current": "Versión Actual",
    "version.update": "Actualizar",
    "version.warning": "Al cambiar la versión requerida, todos los usuarios deberán actualizar",

    // Footer
    "footer.developer": "Desarrollador por",
    "footer.instagram": "Instagram",
    "footer.discord": "Discord",

    // Login
    "login.title": "Panel de Control",
    "login.button": "Entrar con Discord",
    "login.soon": "Próximamente: Google, GitHub y más opciones",

    // Messages
    "msg.success": "Éxito",
    "msg.error": "Error",
    "msg.deleted": "Eliminado",
    "msg.created": "Creado",
    "msg.updated": "Actualizado",
    "msg.banned": "Baneado",
    "msg.unbanned": "Desbaneado",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.features": "Функции",
    "nav.pricing": "Цены",
    "nav.docs": "Документация",
    "nav.login": "Войти",
    "nav.getStarted": "Начать",

    // Hero
    "hero.badge": "Профессиональная Платформа Аутентификации",
    "hero.title": "Защитите Ваше Приложение",
    "hero.subtitle": "С AuthGuard",
    "hero.description":
      "Корпоративная система аутентификации и управления лицензиями. Защитите ваше ПО с передовой безопасностью, анализом в реальном времени и бесшовной интеграцией.",
    "hero.free": "100% Бесплатно",
    "hero.private": "Приватный и Безопасный",
    "hero.getStarted": "Начать",
    "hero.viewFeatures": "Посмотреть Функции",
    "hero.encryption": "Шифрование с Крайней Крайней Точки",
    "hero.hwid": "Защита HWID",
    "hero.analytics": "Анализ в Реальном Времени",

    // Features
    "features.title": "Все, Что Нужно для Защиты Вашего Приложения",
    "features.subtitle": "Мощные функции для разработчиков, требующих безопасности и надежности.",
    "features.security": "Продвинутая Безопасность",
    "features.securityDesc": "Военное шифрование и защита HWID для безопасности ваших приложений.",
    "features.users": "Управление Пользователями",
    "features.usersDesc": "Комплексная панель с отслеживанием сессий в реальном времени.",
    "features.analytics": "Панель Аналитики",
    "features.analyticsDesc": "Красивые графики и статистика для мониторинга использования приложения.",
    "features.licenses": "Управление Лицензиями",
    "features.licensesDesc": "Генерация, управление и отслеживание лицензий с датами истечения.",
    "features.notifications": "Уведомления в Реальном Времени",
    "features.notificationsDesc": "Мгновенные уведомления для всех критических событий.",
    "features.hwid": "Система Сброса HWID",
    "features.hwidDesc": "Автоматические запросы сброса ID оборудования с рабочим процессом одобрения.",
    "features.deploy": "Мгновенное Развертывание",
    "features.deployDesc": "Разверните за минуты с нашей простой интеграцией API.",
    "features.api": "API Маршруты",
    "features.apiDesc": "RESTful API endpoints для бесшовной интеграции с приложениями.",

    // Stats
    "stats.users": "Активных Пользователей",
    "stats.uptime": "Доступность",
    "stats.apps": "Защищенных Приложений",
    "stats.support": "Поддержка",

    // CTA
    "cta.title": "Готовы Защитить Ваше Приложение?",
    "cta.description": "Присоединяйтесь к тысячам разработчиков, доверяющих AuthGuard.",
    "cta.trial": "Войти Сейчас",
    "cta.docs": "Посмотреть Документацию",

    // Dashboard
    "dashboard.title": "Панель Управления",
    "dashboard.logout": "Выход",
    "dashboard.refresh": "Обновить",
    "dashboard.myCredentials": "Мои Учетные Данные",
    "dashboard.users": "Пользователи",
    "dashboard.killSession": "Убить Сессию",
    "dashboard.createUser": "Создать Пользователя",
    "dashboard.banned": "Заблокированные",
    "dashboard.hwidResets": "Сброс HWID",
    "dashboard.version": "Версия",
    "dashboard.installation": "Установка",
    "dashboard.documentation": "Документация",
    "dashboard.licenses": "Лицензии",
    "dashboard.contact": "Контакт",

    // Credentials
    "creds.username": "Имя пользователя",
    "creds.appName": "Название приложения",
    "creds.ownerId": "ID владельца",
    "creds.secret": "Секрет",
    "creds.copy": "Копировать",
    "creds.copied": "Скопировано",

    // Users
    "users.id": "ID",
    "users.username": "Пользователь",
    "users.hwid": "HWID",
    "users.ip": "IP",
    "users.lastLogin": "Последний вход",
    "users.status": "Статус",
    "users.actions": "Действия",
    "users.delete": "Удалить",
    "users.kill": "Убить",
    "users.banHW": "Бан HW",
    "users.banIP": "Бан IP",
    "users.changePass": "Пароль",
    "users.noUsers": "Нет пользователей",

    // Create User
    "create.title": "Создать Пользователя",
    "create.username": "Имя пользователя",
    "create.password": "Пароль",
    "create.button": "Создать",

    // Kill Session
    "kill.title": "Принудительный Выход",
    "kill.username": "Пользователь для отключения",
    "kill.button": "Убить Сессию",
    "kill.warning": "Заблокирует пользователя и закроет все открытые EXE",

    // Banned
    "banned.title": "Заблокированные Hardware/IP",
    "banned.type": "Тип",
    "banned.value": "Значение",
    "banned.reason": "Причина",
    "banned.date": "Дата",
    "banned.unban": "Разблокировать",
    "banned.noItems": "Нет заблокированных элементов",

    // Version
    "version.title": "Версия Клиента",
    "version.required": "Требуемая Версия",
    "version.current": "Текущая Версия",
    "version.update": "Обновить",
    "version.warning": "Изменение требуемой версии заставит всех пользователей обновиться",

    // Footer
    "footer.developer": "Разработчик",
    "footer.instagram": "Instagram",
    "footer.discord": "Discord",

    // Login
    "login.title": "Панель Управления",
    "login.button": "Войти через Discord",
    "login.soon": "Скоро: Google, GitHub и другие опции",

    // Messages
    "msg.success": "Успех",
    "msg.error": "Ошибка",
    "msg.deleted": "Удалено",
    "msg.created": "Создано",
    "msg.updated": "Обновлено",
    "msg.banned": "Заблокировано",
    "msg.unbanned": "Разблокировано",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.features": "विशेषताएं",
    "nav.pricing": "मूल्य निर्धारण",
    "nav.docs": "दस्तावेज़",
    "nav.login": "लॉगिन",
    "nav.getStarted": "शुरू करें",

    // Hero
    "hero.badge": "पेशेवर प्रमाणीकरण प्लेटफॉर्म",
    "hero.title": "अपने एप्लिकेशन को सुरक्षित करें",
    "hero.subtitle": "AuthGuard के साथ",
    "hero.description":
      "एंटरप्राइज-ग्रेड प्रमाणीकरण और लाइसेंस प्रबंधन प्रणाली। उन्नत सुरक्षा, रीयल-टाइम एनालिटिक्स और सहज एकीकरण के साथ अपने सॉफ़्टवेयर की रक्षा करें।",
    "hero.free": "100% मुफ्त",
    "hero.private": "निजी और सुरक्षित",
    "hero.getStarted": "शुरू करें",
    "hero.viewFeatures": "फीचर देखें",
    "hero.encryption": "सिंडलेट टो एन्ड सिंडलेट एन्क्रिप्शन",
    "hero.hwid": "HWID सुरक्षा",
    "hero.analytics": "रीयल-टाइम एनालिटिक्स",

    // Features
    "features.title": "आपके ऐप को सुरक्षित करने के लिए सब कुछ",
    "features.subtitle": "डेवलपर्स के लिए शक्तिशाली फीचर जो सुरक्षा और विश्वसनीयता की मांग करते हैं।",
    "features.security": "उन्नत सुरक्षा",
    "features.securityDesc": "आपके एप्लिकेशन को सुरक्षित करने के लिए मिलिट्री-ग्रेड एन्क्रिप्शन।",
    "features.users": "उपयोगकर्ता प्रबंधन",
    "features.usersDesc": "रीयल-टाइम सत्र ट्रैकिंग के साथ व्यापक डैशबोर्ड।",
    "features.analytics": "एनालिटिक्स डैशबोर्ड",
    "features.analyticsDesc": "आपके एप्लिकेशन उपयोग की निगरानी के लिए सुंदर चार्ट।",
    "features.licenses": "लाइसेंस प्रबंधन",
    "features.licensesDesc": "समाप्ति तिथियों के साथ लाइसेंस उत्पन्न करें और ट्रैक करें।",
    "features.notifications": "रीयल-टाइम सूचनाएं",
    "features.notificationsDesc": "सभी महत्वपूर्ण इवेंट के लिए तत्काल सूचनाएं।",
    "features.hwid": "HWID रीसेट सिस्टम",
    "features.hwidDesc": "अनुमोदन वर्कफ़्लो के साथ स्वचालित हार्डवेयर ID रीसेट अनुरोध।",
    "features.deploy": "तत्काल परिनियोजन",
    "features.deployDesc": "हमारे सरल API एकीकरण के साथ मिनटों में डिप्लॉय करें।",
    "features.api": "API मार्ग",
    "features.apiDesc": "आपके एप्लिकेशन के साथ सहज एकीकरण के लिए RESTful API।",

    // Stats
    "stats.users": "सक्रिय उपयोगकर्ता",
    "stats.uptime": "अपटाइम",
    "stats.apps": "सुरक्षित ऐप्स",
    "stats.support": "सहायता",

    // CTA
    "cta.title": "अपने एप्लिकेशन को सुरक्षित करने के लिए तैयार हैं?",
    "cta.description": "हजारों डेवलपर्स जो AuthGuard पर भरोसा करते हैं उनसे जुड़ें।",
    "cta.trial": "अभी लॉगिन करें",
    "cta.docs": "दस्तावेज़ देखें",

    // Dashboard
    "dashboard.title": "नियंत्रण पैनल",
    "dashboard.logout": "लॉग आउट",
    "dashboard.refresh": "रिफ्रेश",
    "dashboard.myCredentials": "मेरी साख",
    "dashboard.users": "उपयोगकर्ता",
    "dashboard.killSession": "सत्र समाप्त",
    "dashboard.createUser": "उपयोगकर्ता बनाएं",
    "dashboard.banned": "प्रतिबंधित",
    "dashboard.hwidResets": "HWID रीसेट",
    "dashboard.version": "संस्करण",
    "dashboard.installation": "इंस्टॉलेशन",
    "dashboard.documentation": "दस्तावेज़ीकरण",
    "dashboard.licenses": "लाइसेंस",
    "dashboard.contact": "संपर्क",

    // Credentials
    "creds.username": "उपयोगकर्ता नाम",
    "creds.appName": "ऐप का नाम",
    "creds.ownerId": "मालिक आईडी",
    "creds.secret": "गुप्त",
    "creds.copy": "कॉपी",
    "creds.copied": "कॉपी किया गया",

    // Users
    "users.id": "आईडी",
    "users.username": "उपयोगकर्ता",
    "users.hwid": "HWID",
    "users.ip": "IP",
    "users.lastLogin": "अंतिम लॉगिन",
    "users.status": "स्थिति",
    "users.actions": "क्रियाएं",
    "users.delete": "हटाएं",
    "users.kill": "समाप्त",
    "users.banHW": "HW प्रतिबंधित",
    "users.banIP": "IP प्रतिबंधित",
    "users.changePass": "पासवर्ड",
    "users.noUsers": "कोई उपयोगकर्ता नहीं",

    // Create User
    "create.title": "उपयोगकर्ता बनाएं",
    "create.username": "उपयोगकर्ता नाम",
    "create.password": "पासवर्ड",
    "create.button": "बनाएं",

    // Kill Session
    "kill.title": "जबरन लॉगआउट",
    "kill.username": "समाप्त करने के लिए उपयोगकर्ता",
    "kill.button": "सत्र समाप्त करें",
    "kill.warning": "उपयोगकर्ता को ब्लॉक करेगा और सभी खुले EXE बंद कर देगा",

    // Banned
    "banned.title": "प्रतिबंधित हार्डवेयर/IP",
    "banned.type": "प्रकार",
    "banned.value": "मान",
    "banned.reason": "कारण",
    "banned.date": "तारीख",
    "banned.unban": "प्रतिबंध हटाएं",
    "banned.noItems": "कोई प्रतिबंधित आइटम नहीं",

    // Version
    "version.title": "क्लाइंट संस्करण",
    "version.required": "आवश्यक संस्करण",
    "version.current": "वर्तमान संस्करण",
    "version.update": "अपडेट",
    "version.warning": "आवश्यक संस्करण बदलने से सभी उपयोगकर्ताओं को अपडेट करना होगा",

    // Footer
    "footer.developer": "डेवलपर द्वारा",
    "footer.instagram": "Instagram",
    "footer.discord": "Discord",

    // Login
    "login.title": "नियंत्रण पैनल",
    "login.button": "Discord से प्रवेश करें",
    "login.soon": "जल्द आ रहा है: Google, GitHub और अधिक विकल्प",

    // Messages
    "msg.success": "सफलता",
    "msg.error": "त्रुटि",
    "msg.deleted": "हटा दिया गया",
    "msg.created": "बनाया गया",
    "msg.updated": "अपडेट किया गया",
    "msg.banned": "प्रतिबंधित",
    "msg.unbanned": "प्रतिबंध हटाया गया",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.features": "المميزات",
    "nav.pricing": "الأسعار",
    "nav.docs": "التوثيق",
    "nav.login": "تسجيل الدخول",
    "nav.getStarted": "ابدأ الآن",

    // Hero
    "hero.badge": "منصة مصادقة احترافية",
    "hero.title": "تأمين تطبيقك",
    "hero.subtitle": "مع AuthGuard",
    "hero.description":
      "نظام مصادقة وإدارة تراخيص على مستوى المؤسسات. احمِ برامجك بأمان متقدم وتحليلات فورية وتكامل سلس.",
    "hero.free": "100% مجاناً",
    "hero.private": "خاصة وآمن",
    "hero.getStarted": "ابدأ الآن",
    "hero.viewFeatures": "عرض المميزات",
    "hero.encryption": "تشفير من النهاية إلى النهاية",
    "hero.hwid": "حماية HWID",
    "hero.analytics": "تحليلات فورية",

    // Features
    "features.title": "كل ما تحتاجه لتأمين تطبيقك",
    "features.subtitle": "ميزات قوية مصممة للمطورين الذين يطالبون بالأمان والموثوقية.",
    "features.security": "أمان متقدم",
    "features.securityDesc": "تشفير عسكري وحماية HWID لتأمين تطبيقاتك.",
    "features.users": "إدارة المستخدمين",
    "features.usersDesc": "لوحة تحكم شاملة مع تتبع الجلسات في الوقت الفعلي.",
    "features.analytics": "لوحة التحليلات",
    "features.analyticsDesc": "رسوم بيانية جميلة لمراقبة استخدام التطبيق.",
    "features.licenses": "إدارة التراخيص",
    "features.licensesDesc": "إنشاء وإدارة وتتبع التراخيص مع تواريخ انتهاء الصلاحية.",
    "features.notifications": "إشعارات فورية",
    "features.notificationsDesc": "إشعارات فورية لجميع الأحداث الحرجة.",
    "features.hwid": "نظام إعادة تعيين HWID",
    "features.hwidDesc": "طلبات تلقائية لإعادة تعيين معرف الأجهزة مع سير عمل الموافقة.",
    "features.deploy": "نشر فوري",
    "features.deployDesc": "انشر في دقائق مع تكامل API البسيط الخاص بنا.",
    "features.api": "مسارات API",
    "features.apiDesc": "نقاط نهاية RESTful API للتكامل السلس مع تطبيقاتك.",

    // Stats
    "stats.users": "مستخدمون نشطون",
    "stats.uptime": "وقت التشغيل",
    "stats.apps": "تطبيقات محمية",
    "stats.support": "دعم",

    // CTA
    "cta.title": "هل أنت مستعد لتأمين تطبيقك؟",
    "cta.description": "انضم إلى آلاف المطورين الذين يثقون في AuthGuard.",
    "cta.trial": "تسجيل الدخول الآن",
    "cta.docs": "عرض الوثائق",

    // Dashboard
    "dashboard.title": "لوحة التحكم",
    "dashboard.logout": "تسجيل الخروج",
    "dashboard.refresh": "تحديث",
    "dashboard.myCredentials": "بيانات الاعتماد",
    "dashboard.users": "المستخدمون",
    "dashboard.killSession": "إنهاء الجلسة",
    "dashboard.createUser": "إنشاء مستخدم",
    "dashboard.banned": "المحظورون",
    "dashboard.hwidResets": "إعادة تعيين HWID",
    "dashboard.version": "الإصدار",
    "dashboard.installation": "التثبيت",
    "dashboard.documentation": "التوثيق",
    "dashboard.licenses": "التراخيص",
    "dashboard.contact": "اتصل",

    // Credentials
    "creds.username": "اسم المستخدم",
    "creds.appName": "اسم التطبيق",
    "creds.ownerId": "معرف المالك",
    "creds.secret": "السر",
    "creds.copy": "نسخ",
    "creds.copied": "تم النسخ",

    // Users
    "users.id": "المعرف",
    "users.username": "المستخدم",
    "users.hwid": "HWID",
    "users.ip": "IP",
    "users.lastLogin": "آخر تسجيل دخول",
    "users.status": "الحالة",
    "users.actions": "الإجراءات",
    "users.delete": "حذف",
    "users.kill": "إنهاء",
    "users.banHW": "حظر HW",
    "users.banIP": "حظر IP",
    "users.changePass": "كلمة المرور",
    "users.noUsers": "لا يوجد مستخدمون",

    // Create User
    "create.title": "إنشاء مستخدم",
    "create.username": "اسم المستخدم",
    "create.password": "كلمة المرور",
    "create.button": "إنشاء",

    // Kill Session
    "kill.title": "فرض تسجيل الخروج",
    "kill.username": "المستخدم المراد إنهاؤه",
    "kill.button": "إنهاء الجلسة",
    "kill.warning": "سيحظر المستخدم ويغلق جميع ملفات EXE المفتوحة",

    // Banned
    "banned.title": "الأجهزة/IP المحظورة",
    "banned.type": "النوع",
    "banned.value": "القيمة",
    "banned.reason": "السبب",
    "banned.date": "التاريخ",
    "banned.unban": "إلغاء الحظر",
    "banned.noItems": "لا توجد عناصر محظورة",

    // Version
    "version.title": "إصدار العميل",
    "version.required": "الإصدار المطلوب",
    "version.current": "الإصدار الحالي",
    "version.update": "تحديث",
    "version.warning": "سيؤدي تغيير الإصدار المطلوب إلى إجبار جميع المستخدمين على التحديث",

    // Footer
    "footer.developer": "مطور بواسطة",
    "footer.instagram": "Instagram",
    "footer.discord": "Discord",

    // Login
    "login.title": "لوحة التحكم",
    "login.button": "الدخول عبر Discord",
    "login.soon": "قريباً: Google و GitHub والمزيد من الخيارات",

    // Messages
    "msg.success": "نجح",
    "msg.error": "خطأ",
    "msg.deleted": "تم الحذف",
    "msg.created": "تم الإنشاء",
    "msg.updated": "تم التحديث",
    "msg.banned": "تم الحظر",
    "msg.unbanned": "تم إلغاء الحظر",
  },
}

// Language Context
const LanguageContext = createContext<{
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && ["en", "es", "ru", "hi", "ar"].includes(saved)) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    return translations[language][key] || key
  }
  return { t }
}
