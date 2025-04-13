"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <head>
                <title>Daily Report - Quản lý báo cáo hàng ngày</title>
                <meta
                    name="description"
                    content="Ứng dụng quản lý báo cáo công việc hàng ngày"
                />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                        {children}
                    </main>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </AuthProvider>
            </body>
        </html>
    );
}
