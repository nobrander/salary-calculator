import { useId, useMemo, useState } from "react";

/* =========================
   공통 유틸
========================= */
function formatKRW(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "-";
  return x.toLocaleString("ko-KR") + "원";
}

function monthlyRate(annualPercent) {
  const r = Number(annualPercent);
  if (!Number.isFinite(r)) return null;
  return r / 100 / 12;
}

function pmt(P, i, n) {
  if (!(P > 0) || !(n > 0)) return null;
  if (!(i > 0)) return P / n;
  const pow = Math.pow(1 + i, n);
  return (P * i * pow) / (pow - 1);
}

// 입력 필드용 숫자 포맷 (100000 -> 100,000)
function formatNumberInputDisplay(value) {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  const num = Number(digits);
  if (!Number.isFinite(num)) return raw;
  return num.toLocaleString("ko-KR");
}

/* =========================
   공통 UI 컴포넌트
========================= */
function InputRow({ label, placeholder, value, onChange, suffix, isMoney = false }) {
  const id = useId();
  const displayValue = isMoney ? formatNumberInputDisplay(value) : value;

  const handleChange = (e) => {
    let v = e.target.value;
    if (isMoney) {
      v = v.replace(/[^\d]/g, "");
    }
    onChange(v);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium tracking-wide text-slate-400">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className="input-field w-full rounded-xl px-4 py-3 text-sm font-medium"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          inputMode="decimal"
        />
        {suffix ? (
          <div className="input-suffix shrink-0 rounded-xl px-3 py-3 text-xs font-semibold">
            {suffix}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SelectRow({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-medium tracking-wide text-slate-400">{label}</label>
      <select
        id={id}
        className="select-field w-full rounded-xl px-4 py-3 text-sm font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200",
        active ? "tab-active" : "tab-inactive",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Badge({ tone = "life", children }) {
  const toneMap = {
    money: "badge-money",
    time: "badge-time",
    career: "badge-career",
    safety: "badge-safety",
    life: "badge-life",
  };
  const cls = toneMap[tone] ?? toneMap.life;

  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold " +
        cls
      }
    >
      {children}
    </span>
  );
}

function PresetButtons({ presets, onApply }) {
  if (!presets?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onApply(p)}
          className="preset-chip rounded-full px-4 py-1.5 text-xs font-semibold"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function ShockComment({ tone, children }) {
  if (!children) return null;
  const styles = {
    roast: "bg-red-500/10 border-red-500/20 text-red-300",
    warn: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    ok: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    praise: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
  };
  const icons = { roast: "🔥", warn: "⚠️", ok: "💡", praise: "🎉" };
  const cls = styles[tone] ?? styles.warn;
  const icon = icons[tone] ?? "💬";
  return (
    <div className={"shock-card rounded-2xl border-2 p-5 " + cls}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div className="text-sm font-extrabold leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* =========================
   🏠 전월세 화면 → 전세 vs 월세 혈전
========================= */
function RentVsJeonseScreen() {
  const [periodValue, setPeriodValue] = useState("48");
  const [periodUnit, setPeriodUnit] = useState("month"); // day, month, year
  const [monthlySalary, setMonthlySalary] = useState("3000000");

  const [rentDeposit, setRentDeposit] = useState("10000000");
  const [monthlyRent, setMonthlyRent] = useState("700000");
  const [rentRentUnit, setRentRentUnit] = useState("month");
  const [rentMgmt, setRentMgmt] = useState("100000");
  const [rentMgmtUnit, setRentMgmtUnit] = useState("month");

  const [loanAmount, setLoanAmount] = useState("200000000");
  const [loanRate, setLoanRate] = useState("4.5");
  const [jeonseMgmt, setJeonseMgmt] = useState("100000");
  const [jeonseMgmtUnit, setJeonseMgmtUnit] = useState("month");
  const [repayType, setRepayType] = useState("interest_only");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "서울 원룸 생존 모드",
      periodValue: "48",
      periodUnit: "month",
      monthlySalary: "3000000",
      rentDeposit: "10000000",
      monthlyRent: "700000",
      rentRentUnit: "month",
      rentMgmt: "100000",
      rentMgmtUnit: "month",
      loanAmount: "200000000",
      loanRate: "4.5",
      jeonseMgmt: "100000",
      jeonseMgmtUnit: "month",
      repayType: "interest_only",
    },
    {
      label: "신혼, 빚 내서 시작 모드",
      periodValue: "48",
      periodUnit: "month",
      monthlySalary: "4500000",
      rentDeposit: "30000000",
      monthlyRent: "1200000",
      rentRentUnit: "month",
      rentMgmt: "150000",
      rentMgmtUnit: "month",
      loanAmount: "300000000",
      loanRate: "4.0",
      jeonseMgmt: "150000",
      jeonseMgmtUnit: "month",
      repayType: "amortizing",
    },
  ];

  function applyPreset(p) {
    setPeriodValue(p.periodValue);
    setPeriodUnit(p.periodUnit);
    setMonthlySalary(p.monthlySalary);
    setRentDeposit(p.rentDeposit);
    setMonthlyRent(p.monthlyRent);
    setRentRentUnit(p.rentRentUnit);
    setRentMgmt(p.rentMgmt);
    setRentMgmtUnit(p.rentMgmtUnit);
    setLoanAmount(p.loanAmount);
    setLoanRate(p.loanRate);
    setJeonseMgmt(p.jeonseMgmt);
    setJeonseMgmtUnit(p.jeonseMgmtUnit);
    setRepayType(p.repayType);
  }

  function periodToMonths(value, unit) {
    const v = Number(value);
    if (!(v > 0)) return null;
    if (unit === "day") return v / 30;
    if (unit === "year") return v * 12;
    return v;
  }

  function toMonthly(amount, unit) {
    const a = Number(amount);
    if (!(a >= 0)) return null;
    if (unit === "day") return a * 30;
    if (unit === "year") return a / 12;
    return a;
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const months = periodToMonths(snapshot.periodValue, snapshot.periodUnit);
    const salary = Number(snapshot.monthlySalary);

    const dep = Number(snapshot.rentDeposit);
    const rRentMonthly = toMonthly(snapshot.monthlyRent, snapshot.rentRentUnit) ?? 0;
    const rMgmtMonthly = toMonthly(snapshot.rentMgmt, snapshot.rentMgmtUnit) ?? 0;

    const L = Number(snapshot.loanAmount);
    const rJeonseMgmtMonthly = toMonthly(snapshot.jeonseMgmt, snapshot.jeonseMgmtUnit) ?? 0;
    const r = monthlyRate(snapshot.loanRate);

    if (!(months > 0)) return null;
    if (!(rRentMonthly >= 0 && rMgmtMonthly >= 0 && dep >= 0)) return null;
    if (!(L >= 0 && rJeonseMgmtMonthly >= 0)) return null;
    if (r === null || r < 0) return null;

    const m = months;

    const rentCashOut = (rRentMonthly + rMgmtMonthly) * m;

    let jeonseCashOut = 0;
    let jeonseMonthlyPayment = 0;
    let jeonseInterestTotal = 0;
    let jeonsePrincipalRepaid = 0;

    if (L === 0) {
      jeonseCashOut = rJeonseMgmtMonthly * m;
    } else {
      const n = Math.round(m);

      if (snapshot.repayType === "interest_only" || snapshot.repayType === "grace") {
        const monthlyInterest = L * r;
        jeonseMonthlyPayment = monthlyInterest;
        jeonseInterestTotal = monthlyInterest * m;
        jeonsePrincipalRepaid = 0;
        jeonseCashOut = (monthlyInterest + rJeonseMgmtMonthly) * m;
      } else if (snapshot.repayType === "amortizing") {
        const payment = pmt(L, r, n) ?? 0;
        jeonseMonthlyPayment = payment;
        const totalPaid = payment * n;
        jeonseInterestTotal = Math.max(0, totalPaid - L);
        jeonsePrincipalRepaid = L;
        jeonseCashOut = (payment + rJeonseMgmtMonthly) * m;
      } else if (snapshot.repayType === "principal") {
        const principalPerMonth = L / n;
        const firstInterest = L * r;
        const lastInterest = principalPerMonth * r;
        const avgInterest = (firstInterest + lastInterest) / 2;
        const avgPayment = principalPerMonth + avgInterest;

        jeonseMonthlyPayment = avgPayment;
        const totalInterest = avgInterest * n;
        jeonseInterestTotal = totalInterest;
        jeonsePrincipalRepaid = L;
        jeonseCashOut = (avgPayment + rJeonseMgmtMonthly) * m;
      } else if (snapshot.repayType === "bullet") {
        const monthlyInterest = L * r;
        jeonseMonthlyPayment = monthlyInterest;
        jeonseInterestTotal = monthlyInterest * m;
        jeonsePrincipalRepaid = 0;
        jeonseCashOut = (monthlyInterest + rJeonseMgmtMonthly) * m;
      }
    }

    const diff = rentCashOut - jeonseCashOut;
    const salaryMonths = salary > 0 ? diff / salary : null;

    const winner =
      diff > 0
        ? "이 기간엔 전세 쪽이 덜 털린다"
        : diff < 0
        ? "이 기간엔 월세 쪽이 덜 털린다"
        : "돈만 보면 거의 비슷하다";

    const absSM = Math.abs(salaryMonths ?? 0);
    let shock;
    if (diff > 0 && absSM > 6) {
      shock = { tone: "roast", text: `월세로 살면서 월급 ${absSM.toFixed(1)}개월치를 더 태우는 중이야. 전세대출이라도 알아봐, 진짜로. 이건 '편하니까 월세~' 할 레벨이 아니야.` };
    } else if (diff > 0 && absSM > 2) {
      shock = { tone: "warn", text: `차이가 월급 ${absSM.toFixed(1)}개월치. 적은 돈 아닌데? 전세 진지하게 비교해봐. "귀찮아서 월세"가 제일 비싼 선택이야.` };
    } else if (diff > 0) {
      shock = { tone: "ok", text: "전세가 약간 이득이긴 한데, 큰 차이는 아니야. 보증금 떼일 걱정 없는 월세도 나쁘지 않아." };
    } else if (diff < 0 && absSM > 6) {
      shock = { tone: "roast", text: `전세대출 이자가 월세보다 월급 ${absSM.toFixed(1)}개월치나 더 나가네? 그 대출금리면 그냥 월세 살아. 대출이 독이야.` };
    } else if (diff < 0 && absSM > 2) {
      shock = { tone: "warn", text: "월세가 오히려 싸다? 전세대출 금리를 다시 봐. '전세가 무조건 이득'이라는 환상 깨야 할 때야." };
    } else if (diff < 0) {
      shock = { tone: "ok", text: "거의 비슷하거나 월세가 약간 유리해. 보증금 리스크까지 생각하면 월세도 합리적인 선택이야." };
    } else {
      shock = { tone: "ok", text: "거의 똑같아. 그러면 보증금 리스크 없는 월세가 마음은 편하지." };
    }

    return {
      rentCashOut,
      jeonseCashOut,
      diff,
      salaryMonths,
      winner,
      dep,
      jeonseMonthlyPayment,
      jeonseInterestTotal,
      jeonsePrincipalRepaid,
      periodMonths: m,
      shock,
    };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({
      periodValue,
      periodUnit,
      monthlySalary,
      rentDeposit,
      monthlyRent,
      rentRentUnit,
      rentMgmt,
      rentMgmtUnit,
      loanAmount,
      loanRate,
      jeonseMgmt,
      jeonseMgmtUnit,
      repayType,
    });
  }

  function onReset() {
    setPeriodValue("48"); setPeriodUnit("month"); setMonthlySalary("3000000");
    setRentDeposit("10000000"); setMonthlyRent("700000"); setRentRentUnit("month");
    setRentMgmt("100000"); setRentMgmtUnit("month"); setLoanAmount("200000000");
    setLoanRate("4.5"); setJeonseMgmt("100000"); setJeonseMgmtUnit("month");
    setRepayType("interest_only"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">전세 vs 월세 혈전</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="safety">🧷 안전망</Badge>
          <Badge tone="life">🏠 라이프스타일</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <InputRow
                label="비교 기간"
                placeholder="예: 48"
                value={periodValue}
                onChange={setPeriodValue}
                suffix={
                  <select
                    className="select-field rounded-lg px-2 py-1 text-xs font-medium"
                    value={periodUnit}
                    onChange={(e) => setPeriodUnit(e.target.value)}
                  >
                    <option value="day">일</option>
                    <option value="month">개월</option>
                    <option value="year">년</option>
                  </select>
                }
              />
            </div>
            <InputRow
              label="세후 월급"
              placeholder="예: 3,000,000"
              value={monthlySalary}
              onChange={setMonthlySalary}
              suffix="원/월"
              isMoney
            />
          </div>

          <div className="card-inner rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월세</div>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {showAdvanced ? "고급 설정 숨기기" : "월세/관리비 고급 설정"}
              </button>
            </div>

            {showAdvanced && (
              <div className="grid gap-6 md:grid-cols-3">
                <InputRow
                  label="보증금"
                  placeholder="예: 10,000,000"
                  value={rentDeposit}
                  onChange={setRentDeposit}
                  suffix="원"
                  isMoney
                />
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              <InputRow
                label="월세"
                placeholder="예: 700,000"
                value={monthlyRent}
                onChange={setMonthlyRent}
                suffix={
                  <select
                    className="select-field rounded-lg px-2 py-1 text-xs font-medium"
                    value={rentRentUnit}
                    onChange={(e) => setRentRentUnit(e.target.value)}
                  >
                    <option value="day">원/일</option>
                    <option value="month">원/월</option>
                    <option value="year">원/년</option>
                  </select>
                }
                isMoney
              />
              <InputRow
                label="관리비"
                placeholder="예: 100,000"
                value={rentMgmt}
                onChange={setRentMgmt}
                suffix={
                  <select
                    className="select-field rounded-lg px-2 py-1 text-xs font-medium"
                    value={rentMgmtUnit}
                    onChange={(e) => setRentMgmtUnit(e.target.value)}
                  >
                    <option value="day">원/일</option>
                    <option value="month">원/월</option>
                    <option value="year">원/년</option>
                  </select>
                }
                isMoney
              />
            </div>
          </div>

          <div className="card-inner rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">전세(대출)</div>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <InputRow
                label="대출금"
                placeholder="예: 200,000,000"
                value={loanAmount}
                onChange={setLoanAmount}
                suffix="원"
                isMoney
              />
              <InputRow
                label="대출금리"
                placeholder="예: 4.5"
                value={loanRate}
                onChange={setLoanRate}
                suffix="%"
              />
              <InputRow
                label="관리비"
                placeholder="예: 100,000"
                value={jeonseMgmt}
                onChange={setJeonseMgmt}
                suffix={
                  <select
                    className="select-field rounded-lg px-2 py-1 text-xs font-medium"
                    value={jeonseMgmtUnit}
                    onChange={(e) => setJeonseMgmtUnit(e.target.value)}
                  >
                    <option value="day">원/일</option>
                    <option value="month">원/월</option>
                    <option value="year">원/년</option>
                  </select>
                }
                isMoney
              />
              <SelectRow
                label="상환방식"
                value={repayType}
                onChange={setRepayType}
                options={[
                  { value: "interest_only", label: "거치식(이자만 납부)" },
                  { value: "amortizing", label: "원리금균등(기간=상환기간)" },
                  { value: "principal", label: "원금균등" },
                  { value: "bullet", label: "만기일시(이자만 비교)" },
                ]}
              />
            </div>
            <div className="mt-2 text-xs text-slate-400">
              상환방식은 “비교 기간” 동안 통장에서 빠져나가는 돈 기준으로만 비교해.
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                {computed.winner}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                차이(월세 − 전세대출):{" "}
                <span className="font-semibold">{formatKRW(computed.diff)}</span>
                {computed.salaryMonths !== null ? (
                  <>
                    {" "}
                    · 세후 월급 기준{" "}
                    <span className="font-semibold">
                      {computed.salaryMonths.toFixed(1)}개월치
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월세 (현금유출)</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.rentCashOut)}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  보증금(참고):{" "}
                  <span className="font-semibold">{formatKRW(computed.dep)}</span>
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">전세(대출) (현금유출)</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.jeonseCashOut)}
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  월 대출 납부(관리비 제외):{" "}
                  <span className="font-semibold">
                    {formatKRW(computed.jeonseMonthlyPayment)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  기간 총 이자(추정):{" "}
                  <span className="font-semibold">
                    {formatKRW(computed.jeonseInterestTotal)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  기간 원금상환(추정):{" "}
                  <span className="font-semibold">
                    {formatKRW(computed.jeonsePrincipalRepaid)}
                  </span>
                </div>
              </div>
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>

            <div className="text-xs text-slate-400">
              기준: 비교기간 동안 통장에서 실제로 빠져나간 돈(현금유출) 기준 비교야.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   ☕ 커피 화면 → 카페 중독료
========================= */
function CoffeeScreen() {
  const [daily, setDaily] = useState("5000");
  const [years, setYears] = useState("3");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [monthlySalary, setMonthlySalary] = useState("3000000");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "평일마다 카페 조공",
      daily: "5000",
      years: "3",
      daysPerWeek: "5",
      monthlySalary: "3000000",
    },
    {
      label: "주말 감성카페 루틴",
      daily: "4500",
      years: "3",
      daysPerWeek: "2",
      monthlySalary: "3000000",
    },
  ];

  function applyPreset(p) {
    setDaily(p.daily);
    setYears(p.years);
    setDaysPerWeek(p.daysPerWeek);
    setMonthlySalary(p.monthlySalary);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const d = Number(snapshot.daily);
    const y = Number(snapshot.years);
    const dpw = Number(snapshot.daysPerWeek);
    const salary = Number(snapshot.monthlySalary);

    if (!(d >= 0) || !(y > 0) || !(dpw > 0 && dpw <= 7)) return null;

    const totalDays = Math.round(y * 52 * dpw);
    const total = d * totalDays;
    const monthlyAvg = d * dpw * (52 / 12);
    const salaryMonths = salary > 0 ? total / salary : null;

    const ratio = salary > 0 ? monthlyAvg / salary : 0;
    let shock;
    if (ratio > 0.1) {
      shock = { tone: "roast", text: `월급의 ${(ratio * 100).toFixed(0)}%를 커피에 갈아넣고 있어. 솔직히 너 월급으로는 매일 카페는 사치야. 주 2일이 맥시멈이야.` };
    } else if (ratio > 0.05) {
      shock = { tone: "warn", text: `커피값이 월급의 ${(ratio * 100).toFixed(1)}%. 주 ${dpw}일은 좀 많아. 주 3일로 줄이든가 믹스커피랑 친구 해.` };
    } else if (ratio > 0.02) {
      shock = { tone: "ok", text: `이 정도면 양심적이야. 근데 ${y}년치 합산 ${formatKRW(total)} 보고도 태연하면 인정.` };
    } else {
      shock = { tone: "praise", text: "너 정도 월급이면 매일 마셔도 됨. 커피가 문제가 아니라 다른 데서 새고 있을 듯." };
    }

    return { totalDays, total, monthlyAvg, salaryMonths, d, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ daily, years, daysPerWeek, monthlySalary });
  }

  function onReset() {
    setDaily("5000"); setYears("3"); setDaysPerWeek("5");
    setMonthlySalary("3000000"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">카페 중독료</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="life">🏠 라이프스타일</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="하루 커피 비용"
              placeholder="예: 5,000"
              value={daily}
              onChange={setDaily}
              suffix="원/일"
              isMoney
            />
            <InputRow
              label="기간"
              placeholder="예: 3"
              value={years}
              onChange={setYears}
              suffix="년"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="주 몇 번 마심"
              placeholder="예: 5"
              value={daysPerWeek}
              onChange={setDaysPerWeek}
              suffix="일/주"
            />
            <InputRow
              label="세후 월급(해석용)"
              placeholder="예: 3,000,000"
              value={monthlySalary}
              onChange={setMonthlySalary}
              suffix="원/월"
              isMoney
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                {formatKRW(computed.total)}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                총 {computed.totalDays.toLocaleString("ko-KR")}회 ×{" "}
                {formatKRW(computed.d)}(1회)
                {computed.salaryMonths !== null ? (
                  <>
                    {" "}
                    · 세후 월급 기준{" "}
                    <span className="font-semibold">
                      {computed.salaryMonths.toFixed(1)}개월치
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월 평균 커피 지출</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.monthlyAvg)}
                </div>
              </div>
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">총 커피 지출</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.total)}
                </div>
              </div>
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   🚇 출퇴근 화면 → 이동시간 인생낭비
========================= */
function CommuteScreen() {
  const [minutesPerDay, setMinutesPerDay] = useState("60");
  const [years, setYears] = useState("5");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "왕복 1시간, 5년 갈아넣기",
      minutesPerDay: "60",
      years: "5",
      workDaysPerWeek: "5",
    },
    {
      label: "왕복 1.5시간, 주 3일 출근",
      minutesPerDay: "90",
      years: "3",
      workDaysPerWeek: "3",
    },
  ];

  function applyPreset(p) {
    setMinutesPerDay(p.minutesPerDay);
    setYears(p.years);
    setWorkDaysPerWeek(p.workDaysPerWeek);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const minDay = Number(snapshot.minutesPerDay);
    const y = Number(snapshot.years);
    const dpw = Number(snapshot.workDaysPerWeek);

    if (!(minDay >= 0) || !(y > 0) || !(dpw > 0 && dpw <= 7)) return null;

    const totalDays = Math.round(y * 52 * dpw);
    const totalMinutes = minDay * totalDays;
    const totalHours = totalMinutes / 60;
    const totalDays24h = totalHours / 24;
    const workDays8h = totalHours / 8;

    let shock;
    if (workDays8h > 100) {
      shock = { tone: "roast", text: `출퇴근으로 8시간 근무일 ${workDays8h.toFixed(0)}일을 날렸어. 그 시간에 부업했으면 차 한 대 뽑았다. 회사 근처로 이사해.` };
    } else if (workDays8h > 50) {
      shock = { tone: "warn", text: `근무일 ${workDays8h.toFixed(0)}일치를 지하철에서 보냈어. 그 시간에 자격증 하나 땄다. 리모트 가능한 회사 알아봐.` };
    } else if (workDays8h > 20) {
      shock = { tone: "ok", text: "나쁘지 않은 수준이야. 근데 이 시간에 뭘 할 수 있었을지 한번 상상해봐." };
    } else {
      shock = { tone: "praise", text: "출퇴근 시간 짧네. 이 정도면 삶의 질 지키고 있는 거야. 부러운 사람 많다." };
    }

    return { totalDays, totalHours, totalDays24h, workDays8h, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ minutesPerDay, years, workDaysPerWeek });
  }

  function onReset() {
    setMinutesPerDay("60"); setYears("5"); setWorkDaysPerWeek("5");
    setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">이동시간 인생낭비</div>
          <Badge tone="time">⏱ 시간</Badge>
          <Badge tone="career">🧠 커리어</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="하루 출퇴근 총 시간"
              placeholder="예: 60"
              value={minutesPerDay}
              onChange={setMinutesPerDay}
              suffix="분/일"
            />
            <InputRow
              label="기간"
              placeholder="예: 5"
              value={years}
              onChange={setYears}
              suffix="년"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="주 출근일"
              placeholder="예: 5"
              value={workDaysPerWeek}
              onChange={setWorkDaysPerWeek}
              suffix="일/주"
            />
            <div className="card-inner rounded-xl p-5 text-sm text-slate-400">
              <div className="font-semibold text-slate-100">계산 기준</div>
              <div className="mt-1 text-slate-400">1년 ≈ 52주, 출근일 기준 누적</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                약{" "}
                {computed.totalHours.toLocaleString("ko-KR", {
                  maximumFractionDigits: 0,
                })}
                시간 소모
              </div>
              <div className="mt-2 text-sm text-slate-400">
                출근일 {computed.totalDays.toLocaleString("ko-KR")}일 기준
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">총 시간</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {computed.totalHours.toLocaleString("ko-KR", {
                    maximumFractionDigits: 0,
                  })}
                  h
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">24시간 기준</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {computed.totalDays24h.toLocaleString("ko-KR", {
                    maximumFractionDigits: 1,
                  })}
                  일
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">8시간 근무일</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {computed.workDays8h.toLocaleString("ko-KR", {
                    maximumFractionDigits: 1,
                  })}
                  일
                </div>
              </div>
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   📺 구독 화면 → 구독지옥 고정비
========================= */
function SubscriptionScreen() {
  const [subs, setSubs] = useState([
    { name: "구독 1", amount: "10900" },
    { name: "구독 2", amount: "13900" },
    { name: "구독 3", amount: "7900" },
    { name: "구독 4", amount: "5900" },
  ]);
  const [monthlySalary, setMonthlySalary] = useState("3000000");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "OTT+음악 자동이체 세트",
      subs: [
        { name: "넷플릭스", amount: "10900" },
        { name: "유튜브 프리미엄", amount: "13900" },
        { name: "멜론", amount: "7900" },
        { name: "네이버플러스", amount: "5900" },
      ],
      monthlySalary: "3000000",
    },
    {
      label: "구독 끝판왕 모드",
      subs: [
        { name: "넷플릭스", amount: "17000" },
        { name: "유튜브 프리미엄", amount: "14900" },
        { name: "스포티파이", amount: "10900" },
        { name: "ChatGPT Plus", amount: "8900" },
        { name: "네이버플러스", amount: "4900" },
      ],
      monthlySalary: "3000000",
    },
  ];

  function applyPreset(p) {
    setSubs(p.subs.map((s) => ({ ...s })));
    setMonthlySalary(p.monthlySalary);
  }

  function updateSub(index, field, value) {
    setSubs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSub() {
    setSubs((prev) => [...prev, { name: `구독 ${prev.length + 1}`, amount: "0" }]);
  }

  function removeSub(index) {
    setSubs((prev) => prev.filter((_, i) => i !== index));
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const amounts = snapshot.subs.map((s) => Number(s.amount));
    const salary = Number(snapshot.monthlySalary);

    if (!amounts.every((x) => x >= 0 && Number.isFinite(x))) return null;

    const monthlyTotal = amounts.reduce((sum, x) => sum + x, 0);
    const yearlyTotal = monthlyTotal * 12;
    const salaryMonths = salary > 0 ? yearlyTotal / salary : null;
    const chickens = Math.floor(yearlyTotal / 20000);

    let shock;
    if (salaryMonths !== null && salaryMonths > 1) {
      shock = { tone: "roast", text: `구독료로 매년 월급 ${salaryMonths.toFixed(1)}개월치가 증발해. OTT 켜놓고 넷플릭스 뭐 봐? '다음에 봐야지' 리스트만 쌓이잖아. 당장 하나 끊어.` };
    } else if (salaryMonths !== null && salaryMonths > 0.5) {
      shock = { tone: "warn", text: `연간 ${formatKRW(yearlyTotal)}. 안 보는 거 하나만 끊어도 치킨 ${chickens}마리야. 진짜로 다 보고 있는지 솔직해져봐.` };
    } else if (salaryMonths !== null && salaryMonths > 0.15) {
      shock = { tone: "ok", text: "양심적인 수준이야. 근데 '결제일만 되면 빠지는 유령 구독' 없는지는 확인해봐." };
    } else {
      shock = { tone: "praise", text: "알뜰하네. 이 정도면 구독이 문제가 아니야. 다른 데서 새는 돈을 찾아봐." };
    }

    return { monthlyTotal, yearlyTotal, salaryMonths, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ subs: subs.map((s) => ({ ...s })), monthlySalary });
  }

  function onReset() {
    setSubs([
      { name: "구독 1", amount: "10900" },
      { name: "구독 2", amount: "13900" },
      { name: "구독 3", amount: "7900" },
      { name: "구독 4", amount: "5900" },
    ]);
    setMonthlySalary("3000000"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">구독지옥 고정비</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="life">🏠 라이프스타일</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          {subs.map((sub, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1 grid gap-4 md:grid-cols-2">
                <InputRow
                  label={`구독 ${i + 1} 이름`}
                  placeholder="예: 넷플릭스"
                  value={sub.name}
                  onChange={(v) => updateSub(i, "name", v)}
                />
                <InputRow
                  label={`구독 ${i + 1} 금액`}
                  placeholder="예: 10,900"
                  value={sub.amount}
                  onChange={(v) => updateSub(i, "amount", v)}
                  suffix="원/월"
                  isMoney
                />
              </div>
              {subs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSub(i)}
                  className="mb-1 shrink-0 rounded-xl border border-red-500/20 px-3 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          ))}

          {subs.length < 10 && (
            <button
              type="button"
              onClick={addSub}
              className="w-full rounded-xl border-2 border-dashed border-slate-600 py-3 text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + 구독 추가
            </button>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="세후 월급(해석용)"
              placeholder="예: 3,000,000"
              value={monthlySalary}
              onChange={setMonthlySalary}
              suffix="원/월"
              isMoney
            />
            <div className="card-inner rounded-xl p-5 text-sm text-slate-400">
              <div className="font-semibold text-slate-100">팁</div>
              <div className="mt-1 text-slate-400">
                월 합계와 연간 고정비를 같이 보면 체감이 큼.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : computed ? (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                연간 {formatKRW(computed.yearlyTotal)} 고정비
              </div>
              <div className="mt-2 text-sm text-slate-400">
                월 합계 {formatKRW(computed.monthlyTotal)}
                {computed.salaryMonths !== null ? (
                  <>
                    {" "}
                    · 세후 월급 기준{" "}
                    <span className="font-semibold">
                      {computed.salaryMonths.toFixed(2)}개월치
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월 합계</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.monthlyTotal)}
                </div>
              </div>
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">연간 합계</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.yearlyTotal)}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              작은 구독 여러 개면 "연간 고정비" 숫자가 제일 직관적으로 와닿아.
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   💼 이직 화면 → 이직 미루고 태운 돈
========================= */
function JobChangeDelayScreen() {
  const [currentSalary, setCurrentSalary] = useState("50000000");
  const [nextSalary, setNextSalary] = useState("65000000");
  const [years, setYears] = useState("3");
  const [monthlySalary, setMonthlySalary] = useState("3500000");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "“언젠가 이직” 3년 미룸",
      currentSalary: "50000000",
      nextSalary: "65000000",
      years: "3",
      monthlySalary: "3500000",
    },
    {
      label: "이직 한 번 미루고 2년 태우기",
      currentSalary: "80000000",
      nextSalary: "100000000",
      years: "2",
      monthlySalary: "5000000",
    },
  ];

  function applyPreset(p) {
    setCurrentSalary(p.currentSalary);
    setNextSalary(p.nextSalary);
    setYears(p.years);
    setMonthlySalary(p.monthlySalary);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const cur = Number(snapshot.currentSalary);
    const next = Number(snapshot.nextSalary);
    const y = Number(snapshot.years);
    const monthly = Number(snapshot.monthlySalary);

    if (!(cur >= 0 && next >= 0 && y > 0)) return null;

    const yearlyDiff = next - cur;
    const totalLoss = yearlyDiff * y;
    const salaryMonths = monthly > 0 ? totalLoss / monthly : null;
    const sm = salaryMonths ?? 0;

    let shock;
    if (yearlyDiff <= 0) {
      shock = { tone: "praise", text: "현재 연봉이 더 높거나 같은데? 이직 안 한 게 오히려 정답이었을 수도. 지금 자리 지켜." };
    } else if (sm > 12) {
      shock = { tone: "roast", text: `이직 미룬 대가가 월급 ${sm.toFixed(1)}개월치야. 1년치 월급을 '언젠가~' 하면서 태웠어. 지금 당장 이력서 써. '언젠가'는 안 와.` };
    } else if (sm > 6) {
      shock = { tone: "warn", text: `월급 반년치를 날렸어. 이직이 무섭다고? 지금 자리에서 썩는 게 더 무서운 거야.` };
    } else if (sm > 1) {
      shock = { tone: "ok", text: "아까운 돈이긴 한데, 이직은 타이밍도 있으니까. 근데 타이밍 재다가 평생 갈 수 있어. 빨리 움직여." };
    } else {
      shock = { tone: "ok", text: "차이가 크진 않아. 연봉보다 성장 가능성이나 워라밸도 같이 봐." };
    }

    return { yearlyDiff, totalLoss, salaryMonths, y, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ currentSalary, nextSalary, years, monthlySalary });
  }

  function onReset() {
    setCurrentSalary("50000000"); setNextSalary("65000000");
    setYears("3"); setMonthlySalary("3500000"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">이직 미루고 태운 돈</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="career">🧠 커리어</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="현재 연봉"
              placeholder="예: 50,000,000"
              value={currentSalary}
              onChange={setCurrentSalary}
              suffix="원/년"
              isMoney
            />
            <InputRow
              label="이직 시 연봉"
              placeholder="예: 65,000,000"
              value={nextSalary}
              onChange={setNextSalary}
              suffix="원/년"
              isMoney
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="이직 미룬 기간"
              placeholder="예: 3"
              value={years}
              onChange={setYears}
              suffix="년"
            />
            <InputRow
              label="세후 월급(체감용)"
              placeholder="예: 3,500,000"
              value={monthlySalary}
              onChange={setMonthlySalary}
              suffix="원/월"
              isMoney
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">
            값 입력 후 "계산하기"를 눌러줘.
          </div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                {formatKRW(computed.totalLoss)} 손실
              </div>
              <div className="mt-2 text-sm text-slate-400">
                연봉 차이 {formatKRW(computed.yearlyDiff)} × {computed.y}년
                {computed.salaryMonths !== null ? (
                  <>
                    {" "}

                    · 세후 월급 기준{" "}
                    <span className="font-semibold">
                      {computed.salaryMonths.toFixed(1)}개월치
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   ⏱ 진짜 시급 화면 → 내 진짜 노예 시급
========================= */
function RealWageScreen() {
  const [annualSalary, setAnnualSalary] = useState("50000000");
  const [officialHoursPerWeek, setOfficialHoursPerWeek] = useState("40");
  const [actualHoursPerWeek, setActualHoursPerWeek] = useState("50");
  const [commuteMinutesPerDay, setCommuteMinutesPerDay] = useState("60");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "야근 좀 있는 보통 회사",
      annualSalary: "50000000",
      officialHoursPerWeek: "40",
      actualHoursPerWeek: "50",
      commuteMinutesPerDay: "60",
      workDaysPerWeek: "5",
    },
    {
      label: "인생 갈아넣는 회사",
      annualSalary: "60000000",
      officialHoursPerWeek: "40",
      actualHoursPerWeek: "55",
      commuteMinutesPerDay: "90",
      workDaysPerWeek: "5",
    },
  ];

  function applyPreset(p) {
    setAnnualSalary(p.annualSalary);
    setOfficialHoursPerWeek(p.officialHoursPerWeek);
    setActualHoursPerWeek(p.actualHoursPerWeek);
    setCommuteMinutesPerDay(p.commuteMinutesPerDay);
    setWorkDaysPerWeek(p.workDaysPerWeek);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const annual = Number(snapshot.annualSalary);
    const official = Number(snapshot.officialHoursPerWeek);
    const actual = Number(snapshot.actualHoursPerWeek);
    const commuteMin = Number(snapshot.commuteMinutesPerDay);
    const commuteDays = Number(snapshot.workDaysPerWeek);

    if (!(annual > 0 && official > 0 && actual > 0)) return null;
    if (!(commuteDays > 0 && commuteDays <= 7)) return null;

    const weeksPerYear = 52;
    const officialHoursYear = official * weeksPerYear;
    const actualWorkHoursYear = actual * weeksPerYear;
    const commuteHoursPerWeek = (commuteMin / 60) * commuteDays;
    const totalHoursYear = actualWorkHoursYear + commuteHoursPerWeek * weeksPerYear;

    const nominalHourly = annual / officialHoursYear;
    const realHourly = annual / totalHoursYear;
    const dropPct = ((nominalHourly - realHourly) / nominalHourly) * 100;

    let shock;
    if (dropPct > 40) {
      shock = { tone: "roast", text: `계약서 시급에서 ${dropPct.toFixed(0)}%가 증발했어. 야근+출퇴근 합치면 편의점 알바랑 시급 차이 별로 없을걸? 이게 맞아?` };
    } else if (dropPct > 25) {
      shock = { tone: "warn", text: `시급이 ${dropPct.toFixed(0)}% 녹았어. 야근을 줄이든 출퇴근을 줄이든 둘 중 하나는 해. 시간도 돈이야.` };
    } else if (dropPct > 15) {
      shock = { tone: "ok", text: `${dropPct.toFixed(0)}% 손실. 현실적인 수준이긴 해. 근데 이걸 알고도 야근하는 건 네 선택이야.` };
    } else {
      shock = { tone: "praise", text: "실제 시급이 잘 보존됐네. 워라밸 지키고 있는 거 인정. 이 밸런스 유지해." };
    }

    return { nominalHourly, realHourly, official, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({
      annualSalary,
      officialHoursPerWeek,
      actualHoursPerWeek,
      commuteMinutesPerDay,
      workDaysPerWeek,
    });
  }

  function onReset() {
    setAnnualSalary("50000000"); setOfficialHoursPerWeek("40");
    setActualHoursPerWeek("50"); setCommuteMinutesPerDay("60");
    setWorkDaysPerWeek("5"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">내 진짜 노예 시급</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="time">⏱ 시간</Badge>
          <Badge tone="career">🧠 커리어</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="연봉"
              placeholder="예: 50,000,000"
              value={annualSalary}
              onChange={setAnnualSalary}
              suffix="원/년"
              isMoney
            />
            <InputRow
              label="계약 근무시간"
              placeholder="예: 40"
              value={officialHoursPerWeek}
              onChange={setOfficialHoursPerWeek}
              suffix="시간/주"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="실제 근무시간(야근 포함)"
              placeholder="예: 50"
              value={actualHoursPerWeek}
              onChange={setActualHoursPerWeek}
              suffix="시간/주"
            />
            <InputRow
              label="출퇴근 시간(왕복)"
              placeholder="예: 60"
              value={commuteMinutesPerDay}
              onChange={setCommuteMinutesPerDay}
              suffix="분/일"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="주 출근일"
              placeholder="예: 5"
              value={workDaysPerWeek}
              onChange={setWorkDaysPerWeek}
              suffix="일/주"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : computed ? (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                계약 시급{" "}
                {Math.round(computed.nominalHourly).toLocaleString("ko-KR")}
                원 → 실제 시급{" "}
                {Math.round(computed.realHourly).toLocaleString("ko-KR")}원
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">계약 기준</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {Math.round(computed.nominalHourly).toLocaleString("ko-KR")}원/시간
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  주 {computed.official}시간 × 52주 기준
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  실제 기준(야근+출퇴근 포함)
                </div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {Math.round(computed.realHourly).toLocaleString("ko-KR")}원/시간
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  근무 + 출퇴근 합산 시간으로 계산
                </div>
              </div>
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   🧳 퇴사 버퍼 화면 → 지금 당장 던져도 되나
========================= */
function BufferScreen() {
  const [cash, setCash] = useState("10000000");
  const [fixed, setFixed] = useState("800000");
  const [variable, setVariable] = useState("700000");
  const [targetMonths, setTargetMonths] = useState("6");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "사표 참았다가 던지는 모드",
      cash: "10000000",
      fixed: "800000",
      variable: "700000",
      targetMonths: "6",
    },
    {
      label: "3개월은 버티고 나간다",
      cash: "6000000",
      fixed: "700000",
      variable: "600000",
      targetMonths: "3",
    },
  ];

  function applyPreset(p) {
    setCash(p.cash);
    setFixed(p.fixed);
    setVariable(p.variable);
    setTargetMonths(p.targetMonths);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const cashVal = Number(snapshot.cash);
    const fixedVal = Number(snapshot.fixed);
    const variableVal = Number(snapshot.variable);
    const target = Number(snapshot.targetMonths);

    if (!(cashVal >= 0 && fixedVal >= 0 && variableVal >= 0)) return null;

    const monthlyNeed = fixedVal + variableVal;
    if (monthlyNeed <= 0) return null;

    const currentMonths = cashVal / monthlyNeed;
    const targetTotal = target > 0 ? monthlyNeed * target : null;
    const shortfall = targetTotal !== null ? targetTotal - cashVal : null;

    let shock;
    if (currentMonths < 2) {
      shock = { tone: "roast", text: `${currentMonths.toFixed(1)}개월. 지금 사표 쓰면 다음 달부터 라면이야. 퇴사는 로망이고 현실은 통장잔고야. 참아.` };
    } else if (target > 0 && currentMonths < target * 0.5) {
      shock = { tone: "warn", text: `목표 ${target}개월의 절반도 안 됨. "나 퇴사할 거야~" 말만 하지 말고 목표 금액까지 악으로 깡으로 모아.` };
    } else if (target > 0 && currentMonths >= target) {
      shock = { tone: "praise", text: `목표 버퍼 달성! 던질 준비는 됐어. 이제 이력서만 쓰면 됨. 근데 이직 먼저 하고 퇴사하는 게 멘탈에 이로움.` };
    } else {
      shock = { tone: "ok", text: "애매한 구간이야. 조금만 더 모으면 마음 편하게 던질 수 있어. 조급하지 마." };
    }

    return { monthlyNeed, currentMonths, targetTotal, shortfall, target, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ cash, fixed, variable, targetMonths });
  }

  function onReset() {
    setCash("10000000"); setFixed("800000"); setVariable("700000");
    setTargetMonths("6"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">지금 당장 던져도 되나</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="safety">🧷 안전망</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="현재 현금/예금"
              placeholder="예: 10,000,000"
              value={cash}
              onChange={setCash}
              suffix="원"
              isMoney
            />
            <InputRow
              label="월 고정비(주거비/통신비/보험 등)"
              placeholder="예: 800,000"
              value={fixed}
              onChange={setFixed}
              suffix="원/월"
              isMoney
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="월 변동비(식비/카페/여가 등)"
              placeholder="예: 700,000"
              value={variable}
              onChange={setVariable}
              suffix="원/월"
              isMoney
            />
            <InputRow
              label="목표 버퍼 개월 수"
              placeholder="예: 6"
              value={targetMonths}
              onChange={setTargetMonths}
              suffix="개월"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                지금 버퍼로는 약 {computed.currentMonths.toFixed(1)}개월 버틸 수 있음
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월 필요 생활비</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.monthlyNeed)}
                </div>
              </div>

              {computed.targetTotal !== null && (
                <div className="card-inner rounded-xl p-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    목표 {computed.target}개월 버퍼
                  </div>
                  <div className="mt-2 num-highlight text-2xl font-black">
                    필요 총액 {formatKRW(computed.targetTotal)}
                  </div>
                  {computed.shortfall > 0 ? (
                    <div className="mt-1 text-sm text-slate-400">
                      아직 {formatKRW(computed.shortfall)} 더 필요
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-emerald-700">
                      이미 목표 이상 확보된 상태
                    </div>
                  )}
                </div>
              )}
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   🏡 자취 vs 본가 → 독립 로망 vs 통장 보호
========================= */
function LivingChoiceScreen() {
  const [aloneRent, setAloneRent] = useState("800000");
  const [aloneFood, setAloneFood] = useState("400000");
  const [aloneExtra, setAloneExtra] = useState("200000");

  const [homePay, setHomePay] = useState("300000");
  const [homeExtra, setHomeExtra] = useState("100000");

  const [months, setMonths] = useState("12");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "서울 자취 vs 본가 존버",
      aloneRent: "1200000",
      aloneFood: "400000",
      aloneExtra: "200000",
      homePay: "400000",
      homeExtra: "100000",
      months: "24",
    },
    {
      label: "반지하 감성 vs 통장 방어",
      aloneRent: "800000",
      aloneFood: "350000",
      aloneExtra: "150000",
      homePay: "300000",
      homeExtra: "100000",
      months: "12",
    },
  ];

  function applyPreset(p) {
    setAloneRent(p.aloneRent);
    setAloneFood(p.aloneFood);
    setAloneExtra(p.aloneExtra);
    setHomePay(p.homePay);
    setHomeExtra(p.homeExtra);
    setMonths(p.months);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const aRent = Number(snapshot.aloneRent);
    const aFood = Number(snapshot.aloneFood);
    const aExtra = Number(snapshot.aloneExtra);
    const hPay = Number(snapshot.homePay);
    const hExtra = Number(snapshot.homeExtra);
    const m = Number(snapshot.months);

    if (![aRent, aFood, aExtra, hPay, hExtra, m].every((x) => Number.isFinite(x) && x >= 0))
      return null;
    if (!(m > 0)) return null;

    const aloneMonthly = aRent + aFood + aExtra;
    const homeMonthly = hPay + hExtra;
    const diffMonthly = aloneMonthly - homeMonthly;
    const totalDiff = diffMonthly * m;

    let summary = "";
    if (diffMonthly > 0) {
      summary = `자취가 매달 ${formatKRW(diffMonthly)} 더 쓰는 선택`;
    } else if (diffMonthly < 0) {
      summary = `본가가 매달 ${formatKRW(-diffMonthly)} 더 쓰는 선택`;
    } else {
      summary = "월 비용 기준으로는 거의 비슷한 선택";
    }

    let shock;
    if (diffMonthly > 500000) {
      shock = { tone: "roast", text: `자취하면 매달 ${formatKRW(diffMonthly)}씩 더 나가. ${m}개월이면 ${formatKRW(totalDiff)}. 그 돈이 "자유"값이라고 확신해? 본가에서 통장 지키는 것도 전략이야.` };
    } else if (diffMonthly > 200000) {
      shock = { tone: "warn", text: `월 ${formatKRW(diffMonthly)} 차이. 크진 않지만 쌓이면 큼. 자취가 정신건강에 투자라면 가치 있고, 그냥 "로망"이면 다시 생각해.` };
    } else if (diffMonthly > 0) {
      shock = { tone: "ok", text: "차이가 크지 않네. 이 정도면 자취해도 통장이 크게 안 아파. 마음 가는 대로 해." };
    } else if (diffMonthly < 0) {
      shock = { tone: "warn", text: "본가가 더 비싸다고? 부모님께 드리는 돈이 많은 건지, 아니면 자취 조건이 너무 좋은 건지 한번 봐." };
    } else {
      shock = { tone: "ok", text: "비용은 똑같아. 그러면 돈 말고 정신건강, 출퇴근, 자유도로 결정해." };
    }

    return { aloneMonthly, homeMonthly, totalDiff, summary, months: m, shock };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({
      aloneRent,
      aloneFood,
      aloneExtra,
      homePay,
      homeExtra,
      months,
    });
  }

  function onReset() {
    setAloneRent("800000"); setAloneFood("400000"); setAloneExtra("200000");
    setHomePay("300000"); setHomeExtra("100000"); setMonths("12");
    setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">독립 로망 vs 통장 보호</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="life">🏠 라이프스타일</Badge>
          <Badge tone="safety">🧷 안전망</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="card-inner rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">자취</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <InputRow
                label="월 주거비(월세/이자+관리비)"
                placeholder="예: 800,000"
                value={aloneRent}
                onChange={setAloneRent}
                suffix="원/월"
                isMoney
              />
              <InputRow
                label="월 식비"
                placeholder="예: 400,000"
                value={aloneFood}
                onChange={setAloneFood}
                suffix="원/월"
                isMoney
              />
              <InputRow
                label="기타 생활비(공과금/인터넷 등)"
                placeholder="예: 200,000"
                value={aloneExtra}
                onChange={setAloneExtra}
                suffix="원/월"
                isMoney
              />
            </div>
          </div>

          <div className="card-inner rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">본가</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InputRow
                label="부모님께 드리는 돈/생활비"
                placeholder="예: 300,000"
                value={homePay}
                onChange={setHomePay}
                suffix="원/월"
                isMoney
              />
              <InputRow
                label="기타 비용"
                placeholder="예: 100,000"
                value={homeExtra}
                onChange={setHomeExtra}
                suffix="원/월"
                isMoney
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="비교 기간"
              placeholder="예: 12"
              value={months}
              onChange={setMonths}
              suffix="개월"
            />
            <div className="card-inner rounded-xl p-5 text-sm text-slate-400">
              <div className="font-semibold text-slate-100">해석 팁</div>
              <div className="mt-1 text-slate-400">
                월 차이와 n개월 총 차이를 같이 보면,
                자취에 쓰는 돈이 나에게 얼마나 가치 있는지 감이 더 잡혀.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                {computed.summary}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {computed.months}개월 기준 총 차이:{" "}
                <span className="font-semibold">
                  {formatKRW(computed.totalDiff)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">자취 월 합계</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.aloneMonthly)}
                </div>
              </div>
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">본가 월 합계</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.homeMonthly)}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              이 계산기는 "돈 기준 차이"만 보여줘. 자유, 스트레스, 가족 관계 같은 건 따로 생각해야 해.
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   🎓 자기계발 투자 화면 → 자기계발 본전 찾기
========================= */
function SkillInvestScreen() {
  const [totalCost, setTotalCost] = useState("3000000");
  const [currentSalary, setCurrentSalary] = useState("50000000");
  const [futureSalary, setFutureSalary] = useState("60000000");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "자격증에 월급 태우기 세트",
      totalCost: "3000000",
      currentSalary: "50000000",
      futureSalary: "60000000",
    },
    {
      label: "커리어 갈아엎기 부트캠프",
      totalCost: "7000000",
      currentSalary: "40000000",
      futureSalary: "60000000",
    },
  ];

  function applyPreset(p) {
    setTotalCost(p.totalCost);
    setCurrentSalary(p.currentSalary);
    setFutureSalary(p.futureSalary);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    const cost = Number(snapshot.totalCost);
    const cur = Number(snapshot.currentSalary);
    const fut = Number(snapshot.futureSalary);

    if (!(cost >= 0 && cur >= 0 && fut >= 0)) return null;

    const diffYear = fut - cur;
    const diffMonth = diffYear / 12;

    if (diffYear <= 0) {
      return {
        totalCost: cost,
        diffYear,
        diffMonth,
        breakevenYears: null,
        breakevenMonths: null,
        summary: "연봉이 오르지 않는다면, 금전적으로는 회수가 되지 않는 투자야.",
        shock: { tone: "roast", text: "연봉이 안 오르는데 돈만 쓰겠다고? 취미로 하는 거면 몰라도, '투자'라고 부르긴 어려워. 냉정하게 다시 생각해." },
      };
    }

    const breakevenYears = cost / diffYear;
    const breakevenMonths = cost / diffMonth;
    const summary = `연봉이 연 ${formatKRW(
      diffYear
    )} 만큼 오른다면, 투자금 회수까지 약 ${breakevenYears.toFixed(1)}년`;

    let shock;
    if (breakevenYears > 5) {
      shock = { tone: "roast", text: `회수하려면 ${breakevenYears.toFixed(1)}년. 그 자격증이 진짜 연봉을 올려줄지 냉정하게 봐. "자기계발"이라는 이름의 소비 아닌지 확인해.` };
    } else if (breakevenYears > 2) {
      shock = { tone: "warn", text: `${breakevenYears.toFixed(1)}년이면 본전. 나쁘지 않은데, 중간에 이직하면 더 빨라질 수 있어. 전략적으로 움직여.` };
    } else if (breakevenYears > 1) {
      shock = { tone: "ok", text: `1~2년이면 회수. 괜찮은 투자야. 근데 '예상 연봉'이 희망사항 아니라 현실적인지만 체크해.` };
    } else {
      shock = { tone: "praise", text: "1년 안에 본전? 고민하지 마. 당장 투자해. 이건 고민할 게 아니라 실행할 거야." };
    }

    return {
      totalCost: cost,
      diffYear,
      diffMonth,
      breakevenYears,
      breakevenMonths,
      summary,
      shock,
    };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({
      totalCost,
      currentSalary,
      futureSalary,
    });
  }

  function onReset() {
    setTotalCost("3000000"); setCurrentSalary("50000000");
    setFutureSalary("60000000"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">자기계발 본전 찾기</div>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="career">🧠 커리어</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="총 투자 비용(수강료/교재/시험 등)"
              placeholder="예: 3,000,000"
              value={totalCost}
              onChange={setTotalCost}
              suffix="원"
              isMoney
            />
            <InputRow
              label="현재 연봉"
              placeholder="예: 50,000,000"
              value={currentSalary}
              onChange={setCurrentSalary}
              suffix="원/년"
              isMoney
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="자기계발 후 예상 연봉"
              placeholder="예: 60,000,000"
              value={futureSalary}
              onChange={setFutureSalary}
              suffix="원/년"
              isMoney
            />
            <div className="card-inner rounded-xl p-5 text-sm text-slate-400">
              <div className="font-semibold text-slate-100">입력 팁</div>
              <div className="mt-1 text-slate-400">
                너무 낙관적으로 말고, “현실적으로 가능할 것 같은 연봉”을 적는 게 좋아.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                {computed.summary}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">투자 비용</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.totalCost)}
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">연봉 상승분(연)</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.diffYear)}
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">월 실질 상승분</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.diffMonth)}
                </div>
              </div>
            </div>

            {computed.breakevenYears !== null ? (
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">손익분기점</div>
                <div className="mt-2 text-xl font-black text-white">
                  약 {computed.breakevenYears.toFixed(1)}년 ·{" "}
                  {computed.breakevenMonths.toFixed(0)}개월 차에 본전
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  현실에서는 세금, 승진 속도, 이직 가능성 등이 있어서 이 수치는 감 잡는 용도야.
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-red-50 p-5">
                <div className="text-sm font-bold text-red-800">
                  연봉 상승 가정이 필요해
                </div>
                <div className="mt-2 text-sm text-red-700">
                  예상 연봉이 현재 연봉보다 높게 설정돼야 금전적인 회수 기간을 계산할 수 있어.
                </div>
              </div>
            )}

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   🌴 연차 화면 → 안 쓰면 증발하는 연차값
========================= */
function AnnualLeaveScreen() {
  const [annualDays, setAnnualDays] = useState("15");
  const [usedDays, setUsedDays] = useState("7");
  const [monthlySalary, setMonthlySalary] = useState("3000000");
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState("20");
  const [snapshot, setSnapshot] = useState(null);

  const presets = [
    {
      label: "평균 직장인 연차값",
      annualDays: "15",
      usedDays: "7",
      monthlySalary: "3000000",
      workDaysPerMonth: "20",
    },
    {
      label: "연차 넉넉한 회사",
      annualDays: "20",
      usedDays: "5",
      monthlySalary: "4000000",
      workDaysPerMonth: "20",
    },
  ];

  function applyPreset(p) {
    setAnnualDays(p.annualDays);
    setUsedDays(p.usedDays);
    setMonthlySalary(p.monthlySalary);
    setWorkDaysPerMonth(p.workDaysPerMonth);
  }

  const computed = useMemo(() => {
    if (!snapshot) return null;

    let total = Number(snapshot.annualDays);
    let used = Number(snapshot.usedDays);
    const salary = Number(snapshot.monthlySalary);
    const workDays = Number(snapshot.workDaysPerMonth);

    if (!(total >= 0 && used >= 0 && salary > 0 && workDays > 0)) return null;

    if (used > total) used = total;
    const remaining = total - used;

    const dailyValue = salary / workDays;
    const totalValue = total * dailyValue;
    const usedValue = used * dailyValue;
    const remainingValue = remaining * dailyValue;

    const remainRatio = total > 0 ? remaining / total : 0;
    let shock;
    if (remainRatio > 0.7) {
      shock = { tone: "roast", text: `연차 ${remaining}일 남겨놨어. 그거 ${formatKRW(remainingValue)}짜리 유급휴가인데 그냥 버리는 거야. 회사가 고마워하지도 않아. 당장 신청해.` };
    } else if (remainRatio > 0.5) {
      shock = { tone: "warn", text: `아직 절반 넘게 남았어. "연말에 몰아서 쓸게요~" 하다가 반려당하는 거 한두 번이 아닐 텐데? 지금 잡아.` };
    } else if (remainRatio > 0.2) {
      shock = { tone: "ok", text: "적당히 쓰고 있네. 남은 것도 미리미리 계획 잡아서 써. 연차는 남기는 게 아니라 쓰는 거야." };
    } else {
      shock = { tone: "praise", text: "연차 거의 다 썼네. 이게 맞는 거야. 쉴 때 쉬어야 일도 되는 법. 인정." };
    }

    return {
      total,
      used,
      remaining,
      dailyValue,
      totalValue,
      usedValue,
      remainingValue,
      shock,
    };
  }, [snapshot]);

  function onCalculate() {
    setSnapshot({ annualDays, usedDays, monthlySalary, workDaysPerMonth });
  }

  function onReset() {
    setAnnualDays("15"); setUsedDays("7"); setMonthlySalary("3000000");
    setWorkDaysPerMonth("20"); setSnapshot(null);
  }

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="text-base font-bold text-slate-100">안 쓰면 증발하는 연차값</div>
          <Badge tone="time">⏱ 시간</Badge>
          <Badge tone="money">💸 돈</Badge>
          <Badge tone="life">🏖 휴식</Badge>
        </div>

        <PresetButtons presets={presets} onApply={applyPreset} />

        <div className="mt-5 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="올해 연차 총 일수"
              placeholder="예: 15"
              value={annualDays}
              onChange={setAnnualDays}
              suffix="일"
            />
            <InputRow
              label="이미 사용한 연차"
              placeholder="예: 7"
              value={usedDays}
              onChange={setUsedDays}
              suffix="일"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputRow
              label="세후 월급"
              placeholder="예: 3,000,000"
              value={monthlySalary}
              onChange={setMonthlySalary}
              suffix="원/월"
              isMoney
            />
            <InputRow
              label="월 근무일 수"
              placeholder="예: 20"
              value={workDaysPerMonth}
              onChange={setWorkDaysPerMonth}
              suffix="일/월"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCalculate}
              className="btn-primary flex-1 rounded-2xl py-4 text-base font-bold text-white"
            >
              계산하기
            </button>
            <button
              onClick={onReset}
              className="btn-reset rounded-2xl px-6 py-4 text-base font-bold"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="card-elevated rounded-2xl p-7">
        <div className="text-base font-bold text-slate-100">결과</div>

        {!computed && !snapshot ? (
          <div className="mt-3 text-sm text-slate-400">값 입력 후 "계산하기"를 눌러줘.</div>
        ) : !computed && snapshot ? (
          <div className="mt-3 text-sm font-medium text-red-400">입력값을 확인해줘. 숫자가 올바르지 않거나 범위를 벗어났을 수 있어.</div>
        ) : (
          <div className="result-fade-in mt-5 space-y-4">
            <div className="card-inner rounded-xl p-5">
              <div className="text-sm text-slate-400">한줄 결론</div>
              <div className="mt-2 text-xl font-black text-white">
                연차 1일 = {formatKRW(computed.dailyValue)} 가치
              </div>
              <div className="mt-2 text-sm text-slate-400">
                올해 연차 {computed.total}일 전체 가치:{" "}
                <span className="font-semibold">
                  {formatKRW(computed.totalValue)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">사용한 연차</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {computed.used}일
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  사용한 가치: {formatKRW(computed.usedValue)}
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">남은 연차</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {computed.remaining}일
                </div>
                <div className="mt-1 text-sm text-slate-400">
                  남은 가치: {formatKRW(computed.remainingValue)}
                </div>
              </div>

              <div className="card-inner rounded-xl p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">연차 하루 가치</div>
                <div className="mt-2 num-highlight text-2xl font-black">
                  {formatKRW(computed.dailyValue)}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  세후 월급 ÷ 월 근무일 수 기준
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              실제 연차수당, 회사 규정, 근로기준법에 따른 보상 방식은 회사마다 다를 수 있어.
              여기서는 "하루 쉬는 시간의 금전적 가치"를 잡아보는 용도야.
            </div>

            <ShockComment tone={computed.shock.tone}>{computed.shock.text}</ShockComment>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   메인 App
========================= */
export default function App() {
  const [tab, setTab] = useState("rent");

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="header-glass sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="text-center">
            <h1 className="gradient-text text-3xl font-black tracking-tight">내 월급 어디 갔나 계산기</h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              월급이 어디로 증발하는지 낱낱이 파헤치는 계산기
            </p>
          </div>

          {/* 탭 */}
          <div className="mt-6 flex flex-col items-center gap-2.5">
            {/* 1줄 */}
            <div className="flex flex-wrap justify-center gap-2.5">
              <TabButton active={tab === "rent"} onClick={() => setTab("rent")}>
                🏠 전세 vs 월세
              </TabButton>
              <TabButton active={tab === "coffee"} onClick={() => setTab("coffee")}>
                ☕ 카페 중독료
              </TabButton>
              <TabButton active={tab === "commute"} onClick={() => setTab("commute")}>
                🚇 이동시간
              </TabButton>
              <TabButton active={tab === "subs"} onClick={() => setTab("subs")}>
                📺 구독지옥
              </TabButton>
              <TabButton active={tab === "job"} onClick={() => setTab("job")}>
                💼 이직 지연
              </TabButton>
            </div>

            {/* 2줄 */}
            <div className="flex flex-wrap justify-center gap-2.5">
              <TabButton active={tab === "wage"} onClick={() => setTab("wage")}>
                ⏱ 노예 시급
              </TabButton>
              <TabButton active={tab === "leave"} onClick={() => setTab("leave")}>
                🌴 연차값
              </TabButton>
              <TabButton active={tab === "buffer"} onClick={() => setTab("buffer")}>
                🧳 퇴사 가능?
              </TabButton>
              <TabButton active={tab === "living"} onClick={() => setTab("living")}>
                🏡 독립 vs 절약
              </TabButton>
              <TabButton active={tab === "skill"} onClick={() => setTab("skill")}>
                🎓 자기계발
              </TabButton>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {tab === "rent" && <RentVsJeonseScreen />}
        {tab === "coffee" && <CoffeeScreen />}
        {tab === "commute" && <CommuteScreen />}
        {tab === "subs" && <SubscriptionScreen />}
        {tab === "job" && <JobChangeDelayScreen />}
        {tab === "wage" && <RealWageScreen />}
        {tab === "leave" && <AnnualLeaveScreen />}
        {tab === "buffer" && <BufferScreen />}
        {tab === "living" && <LivingChoiceScreen />}
        {tab === "skill" && <SkillInvestScreen />}
      </div>
    </div>
  );
}
