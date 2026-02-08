import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-4">
      <div className="w-full max-w-md bg-bg-card rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">S&C Admin</h1>
          <p className="text-sm text-text-secondary mt-1">관리자 로그인</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
