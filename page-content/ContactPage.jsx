"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PageShell from "../components/PageShell";
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT, CONSENT_VERSION, XFER_CONSENT_VERSION } from "../data/site";

const TYPES = ["학교 SEL 도입·전체 과정", "교사 연수 의뢰", "학부모 특강", "콘텐츠 협업", "기타"];

const COLLABS = [
  { h: "학교 SEL 도입", d: "학년별 34차시 전체 과정, 교육과정 편성, 웹앱 수업 운영을 함께 설계합니다." },
  { h: "교사 연수", d: "4영역·17개 사회정서기술 이해와 교과 연계 수업 설계 실습." },
  { h: "학부모 특강", d: "가정에서의 감정 코칭, 사춘기 자녀와 소통하는 언어." },
  { h: "콘텐츠 협업", d: "SEL 교재·웹앱 공동 개발, 영상 콘텐츠 기획." },
];

const FAQ = [
  { q: "핵심 15차시는 언제, 어떻게 공개되나요?", a: "학년별 핵심 15차시를 지도안·활동지·슬라이드·웹앱과 함께 무료로 공개할 준비를 하고 있습니다. 공개 소식을 받으시려면 홈 화면 아래에서 이메일을 남겨 주세요." },
  { q: "전체 34차시 과정은 받을 수 있나요?", a: "전체 과정은 연수와 협력 학교를 통해 함께 운영합니다. 학교 정보와 함께 문의해 주시면 방법을 안내해 드립니다." },
  { q: "레브랩 웹앱은 학생 로그인이 필요한가요?", a: "아니요. 공개된 웹앱은 학생 계정 없이 브라우저에서 바로 열립니다. 앱마다 카메라 사용 여부와 저장하는 정보를 콘텐츠 카드에 적어 두었습니다." },
  { q: "온라인 연수도 가능한가요?", a: "가능합니다. 실시간 온라인, 방문 연수, 혼합형 모두 상의해 정합니다." },
];

const EMPTY = { name: "", org: "", email: "", type: "", message: "", agree: false, agreeXfer: false };

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");
  const doneRef = useRef(null);
  useEffect(() => { if (status === "done") doneRef.current?.focus(); }, [status]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (e.currentTarget.elements._gotcha?.value) return;
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()) || !form.message.trim()) {
      setStatus("error"); setError("이름, 이메일, 문의 내용을 확인해 주세요."); return;
    }
    if (!form.agree || !form.agreeXfer) { setStatus("error"); setError("개인정보 수집·이용과 국외 이전, 두 가지 동의에 모두 체크해 주세요."); return; }
    setStatus("sending"); setError("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          이름: form.name.trim(),
          소속: form.org.trim(),
          이메일: form.email.trim(),
          "문의 유형": form.type || "미선택",
          메시지: form.message.trim(),
          "수집·이용 동의": CONSENT_VERSION,
          "국외 이전 동의": XFER_CONSENT_VERSION,
          _replyto: form.email.trim(),
          _subject: `[Lev Lab 문의] ${form.name.trim()}${form.type ? " · " + form.type : ""}`,
        }),
      });
      if (res.ok) { setStatus("done"); setForm(EMPTY); }
      else {
        const data = await res.json().catch(() => ({}));
        setStatus("error"); setError(data?.errors?.[0]?.message || "보내지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setStatus("error"); setError("인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="함께 만들어 가는 교육"
      sub="학교 SEL 도입, 교사 연수, 학부모 특강, 콘텐츠 협업 문의를 환영합니다. 보내 주시면 영업일 1~2일 안에 이메일로 답장드립니다."
    >
      <div className="contact-grid">
        <div>
          <p className="eyebrow">Collaboration</p>
          <h2 className="content-h2">이런 일을 함께합니다</h2>
          <div className="collab-list" style={{ marginTop: 20 }}>
            {COLLABS.map((c) => <div className="collab" key={c.h}><b>{c.h}</b><span>{c.d}</span></div>)}
          </div>
          <p className="content-lead" style={{ fontSize: 15 }}>
            이메일로 바로 보내셔도 됩니다: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--brand)", fontWeight: 700 }}>{CONTACT_EMAIL}</a>
          </p>
        </div>

        <div>
          <p className="sr-only" role="status" aria-live="polite">{status === "done" ? "문의를 보냈습니다. 영업일 1~2일 안에 이메일로 답장드릴게요." : ""}</p>
          {status === "done" ? (
            <div className="cform">
              <div className="sent">
                <h2 ref={doneRef} tabIndex={-1} style={{ fontSize: 22, margin: "0 0 8px" }}>보내 주셔서 고맙습니다</h2>
                <p>영업일 1~2일 안에 이메일로 답장드릴게요.</p>
              </div>
            </div>
          ) : (
            <form className="cform" onSubmit={submit} noValidate aria-labelledby="cform-h">
              <h2 id="cform-h" style={{ fontSize: 20, margin: 0 }}>문의하기</h2>
              <div className="row2">
                <div>
                  <label htmlFor="cf-name">이름 <span className="req" aria-hidden="true">*</span></label>
                  <input id="cf-name" type="text" autoComplete="name" required value={form.name} onChange={update("name")} />
                </div>
                <div>
                  <label htmlFor="cf-org">소속 <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>(선택)</span></label>
                  <input id="cf-org" type="text" autoComplete="organization" placeholder="학교·기관명" value={form.org} onChange={update("org")} />
                </div>
              </div>
              <div>
                <label htmlFor="cf-email">이메일 <span className="req" aria-hidden="true">*</span></label>
                <input id="cf-email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} />
              </div>
              <div>
                <label htmlFor="cf-type">문의 유형</label>
                <select id="cf-type" value={form.type} onChange={update("type")}>
                  <option value="">선택해 주세요</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="cf-msg">문의 내용 <span className="req" aria-hidden="true">*</span></label>
                <textarea id="cf-msg" required value={form.message} onChange={update("message")} placeholder="학교 규모, 학년, 원하시는 일정 등을 적어 주시면 더 빨리 안내할 수 있어요." />
              </div>
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
              <label className="consent" style={{ display: "flex", gap: 8, alignItems: "flex-start", fontWeight: 500 }}>
                <input type="checkbox" checked={form.agree} onChange={update("agree")} style={{ width: "auto", marginTop: 3 }} />
                <span><b style={{ color: "var(--ink)" }}>(필수) 개인정보 수집·이용 동의</b> — 문의 확인과 회신을 위해 이름·이메일·문의 내용(소속은 선택)을 받고, 회신을 마치고 1년 뒤 지웁니다. 동의하지 않으셔도 되지만, 그 경우 폼으로는 문의를 받을 수 없으니 {CONTACT_EMAIL}로 직접 보내 주세요.</span>
              </label>
              <label className="consent" style={{ display: "flex", gap: 8, alignItems: "flex-start", fontWeight: 500 }}>
                <input type="checkbox" checked={form.agreeXfer} onChange={update("agreeXfer")} style={{ width: "auto", marginTop: 3 }} />
                <span><b style={{ color: "var(--ink)" }}>(필수) 개인정보 국외 이전 동의</b> — 위 정보가 Formspree, Inc.(미국, team@formspree.io)로 제출 즉시 암호화 전송되어 접수되고, 레브랩 메일(Google, 미국)로 전달됩니다. 레브랩 보관 기간이 끝나면 함께 지웁니다. 동의하지 않으시면 폼으로 문의할 수 없습니다. <Link href="/privacy">개인정보 처리방침</Link></span>
              </label>
              {status === "error" && <p className="err" role="alert">{error}</p>}
              <button className="btn btn-solid" type="submit" disabled={status === "sending"} style={{ justifyContent: "center" }}>
                {status === "sending" ? "보내는 중…" : "문의 보내기"}
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="content-section" aria-labelledby="faq-h">
        <p className="eyebrow">FAQ</p>
        <h2 className="content-h2" id="faq-h">자주 묻는 질문</h2>
        <div className="faq" style={{ marginTop: 20 }}>
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
