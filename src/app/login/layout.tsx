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
            .login-page{background:#0a1628;min-height:100dvh;min-height:100vh;overflow:hidden}
            .login-landing{position:relative;width:100%;height:100dvh;height:100vh}
            .login-hero{position:absolute;inset:0}
            .login-hero--desktop{display:block}
            .login-hero--mobile{display:none}
            @media(max-width:639px){
              .login-hero--desktop{display:none}
              .login-hero--mobile{display:block}
            }
          `,
        }}
      />
      {children}
    </>
  );
}
