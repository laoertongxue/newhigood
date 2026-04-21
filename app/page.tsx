/**
 * Root page - redirected by middleware
 * Users will be redirected to /auth/login or /dashboard based on auth status
 */
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">加载中...</div>
    </div>
  );
}
