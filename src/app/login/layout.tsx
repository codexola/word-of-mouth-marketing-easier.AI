import type { Metadata } from "next";
import "@/styles/login.css";

export const metadata: Metadata = {
  title: "ログイン | GBP投稿管理システム",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preload" as="image" href="/Homepage1.png" fetchPriority="high" media="(min-width: 640px)" />
      <link rel="preload" as="image" href="/Mobilehompage.png" fetchPriority="high" media="(max-width: 639px)" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html:has(.login-page),body:has(.login-page){margin:0;padding:0;width:100%;max-width:100vw;overflow-x:hidden}
            body:has(.login-page) .app-root{margin:0;padding:0;max-width:100vw;background:#0a1628}
            .login-page{margin:0;padding:0;width:100%;max-width:100vw;background:#0a1628;min-height:100dvh;min-height:100vh}
            .login-hero--desktop{display:block}
            .login-hero--mobile{display:none}
            @media(min-width:640px){
              html:has(.login-page),body:has(.login-page){height:100%;overflow:hidden}
              .login-page{height:100dvh;height:100vh;max-height:100dvh;overflow:hidden}
              .login-landing{position:relative;width:100%;height:100%;overflow:hidden}
              .login-hero--desktop{position:absolute;inset:0}
            }
            @media(max-width:639px){
              html:has(.login-page),body:has(.login-page){height:auto;overflow-x:hidden;overflow-y:auto}
              body:has(.login-page) .app-root{min-height:auto;height:auto}
              .login-page{height:auto;max-height:none;overflow-x:hidden;overflow-y:visible}
              .login-landing{display:flex;flex-direction:column;min-height:100dvh;min-height:100vh;height:auto;overflow:visible}
              .login-hero--desktop{display:none}
              .login-hero--mobile{display:block;position:relative;inset:auto;flex:0 0 auto;width:100%}
            }
          `,
        }}
      />
      {children}
    </>
  );
}
