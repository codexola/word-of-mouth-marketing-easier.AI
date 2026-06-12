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
            .login-page{background:#f5f8fc;min-height:100dvh;min-height:100vh}
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
