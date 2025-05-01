"use client";
import { SessionProvider } from "next-auth/react";
import { ParentComponent } from "@/components/sidebar_resize";  
import Header from "@/components/Header";

export default function CilentSession() {
  return (
    <SessionProvider>
      <Header/>
      <ParentComponent/>
    </SessionProvider>
  );
}
