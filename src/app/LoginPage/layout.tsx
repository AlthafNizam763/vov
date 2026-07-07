// Login is a private entry point — keep it out of search indexes.
export const metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
