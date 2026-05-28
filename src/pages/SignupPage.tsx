import { CheckCircle2, MessageSquare } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'

const PASSWORD_RULES = [
  {
    label: '8자 이상',
    test: (value: string) => value.length >= 8,
  },
  {
    label: '영문 대문자 포함',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: '영문 소문자 포함',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: '숫자 포함',
    test: (value: string) => /\d/.test(value),
  },
  {
    label: '특수문자 포함',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
]

export function SignupPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password],
  )
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = passwordChecks.every((rule) => rule.passed)
  const isPasswordMatched = password.length > 0 && password === confirmPassword
  const canSubmit = nickname.trim().length >= 2 && isEmailValid && isPasswordValid && isPasswordMatched

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    if (!canSubmit) return

    // Cognito/API 연동 전 UI 단계에서는 가입 입력값을 임시 저장해 로그인 화면 복귀 흐름만 확인합니다.
    localStorage.setItem(
      'chattr-last-signup',
      JSON.stringify({
        email,
        nickname,
        password,
      }),
    )
    navigate('/login')
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="flex h-12 shrink-0 items-center px-5">
        <a className="flex items-center gap-2 text-[#0058BE]" href="/login">
          <MessageSquare aria-hidden size={24} strokeWidth={2.5} />
          <span className="text-base font-bold">Chattr</span>
        </a>
      </header>

      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-6 py-8">
        <div className="pointer-events-none absolute left-0 top-0 h-[24rem] w-[34rem] -translate-x-24 -translate-y-24 rounded-full bg-[#0058BE]/10 blur-3xl" />
        <div className="relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_26rem] items-center gap-16 max-lg:max-w-xl max-lg:grid-cols-1">
          <div className="max-w-lg">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0058BE]">Create account</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950">
              Chattr에서 팀 협업을 시작하세요.
            </h1>
            <p className="mt-5 text-sm font-medium leading-6 text-slate-700">
              회원가입은 Cognito 기반 인증 흐름을 전제로 구성되어 있습니다. 비밀번호는 서비스 DB에 저장하지
              않고, 가입 완료 후 로그인 화면에서 인증을 진행합니다.
            </p>
            <div className="mt-8 rounded-lg border border-slate-300 bg-white p-5">
              <h2 className="text-sm font-extrabold text-slate-950">가입 후 처리 흐름</h2>
              <ul className="mt-3 space-y-2 text-sm font-medium leading-5 text-slate-700">
                <li>1. Cognito User Pool에 사용자 등록</li>
                <li>2. 서비스 DB에는 cognito_sub 기반 사용자 정보 저장</li>
                <li>3. 로그인 후 Access Token, Refresh Token 발급</li>
                <li>4. 멀티 디바이스 세션 발급 및 기기 목록 관리</li>
              </ul>
            </div>
          </div>

          <form className="rounded-xl border border-slate-300 bg-white px-7 py-7 shadow-2xl shadow-slate-300/60" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">회원가입</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">계정 생성에 필요한 정보를 입력하세요.</p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <Input
                  id="nickname"
                  label="닉네임"
                  onChange={(event) => setNickname(event.currentTarget.value)}
                  placeholder="예: 김채트"
                  value={nickname}
                />
                <p className="mt-1.5 text-xs font-medium text-slate-500">닉네임은 본명으로 입력해주세요.</p>
                {submitted && nickname.trim().length < 2 ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">닉네임은 2자 이상 입력해주세요.</p>
                ) : null}
              </div>

              <div>
                <Input
                  id="signup-email"
                  label="이메일"
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                />
                {submitted && !isEmailValid ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">올바른 이메일 형식으로 입력해주세요.</p>
                ) : null}
              </div>

              <div>
                <Input
                  id="signup-password"
                  label="비밀번호"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
                  type="password"
                  value={password}
                />
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {passwordChecks.map((rule) => (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        rule.passed ? 'text-[#0058BE]' : 'text-slate-400'
                      }`}
                      key={rule.label}
                    >
                      <CheckCircle2 size={13} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  id="confirm-password"
                  label="비밀번호 확인"
                  onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  type="password"
                  value={confirmPassword}
                />
                {submitted && !isPasswordMatched ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">비밀번호가 일치하지 않습니다.</p>
                ) : null}
              </div>
            </div>

            <Button className="mt-7 w-full" disabled={submitted && !canSubmit} type="submit">
              회원가입 완료
            </Button>

            <p className="mt-5 text-center text-sm font-medium text-slate-700">
              이미 계정이 있으신가요?{' '}
              <a className="font-semibold text-[#0058BE] hover:text-[#004EA8]" href="/login">
                로그인
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
