"use client";

import { useState } from "react";
import Link from "next/link";
import { FORMSPREE_ENDPOINT, CONTACT_EMAIL, CONSENT_VERSION, XFER_CONSENT_VERSION } from "../data/site";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [agreeXfer, setAgreeXfer] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (e.currentTarget.elements._gotcha?.value) return; // 스팸 봇은 조용히 무시
    const value = email.trim();
    if (!agree || !agreeXfer) {
      setStatus("error");
      setMsg("아래 두 가지 동의에 모두 체크해 주세요.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setStatus("error");
      setMsg("이메일 주소를 다시 확인해 주세요.");
      return;
    }
    setStatus("sending");
    setMsg("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          이메일: value,
          "수집·이용 동의": CONSENT_VERSION,
          "국외 이전 동의": XFER_CONSENT_VERSION,
          "문의 유형": "공개 소식 받기",
          _replyto: value,
          _subject: `[Lev Lab 공개 소식 신청] ${value}`,
        }),
      });
      if (res.ok) {
        setStatus("done");
        setMsg("신청이 접수됐어요. 새 수업이 열리면 알려 드릴게요!");
        setEmail("");
        setAgree(false);
        setAgreeXfer(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMsg(data?.errors?.[0]?.message || "신청을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setStatus("error");
      setMsg("인터넷 연결을 확인한 뒤 다시 시도해 주세요.");
    }
  };

  return (
    <section className="band" id="newsletter">
      <div className="wrap">
        <div className="news">
          <h2>새 수업이 열리면 알려 드릴게요</h2>
          <p>핵심 15차시 수업과 새 웹앱이 공개될 때 이메일로 소식을 보냅니다.</p>
          <form onSubmit={submit} noValidate>
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              aria-label="이메일 주소"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
            <button className="btn btn-solid" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "보내는 중…" : "소식 받기"}
            </button>
          </form>
          <div
            className="msg"
            role="status"
            aria-live="polite"
            style={{ color: status === "error" ? "var(--accent-deep)" : "var(--brand)" }}
          >
            {msg}
          </div>
          <label className="news-consent">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              <b>(필수) 개인정보 수집·이용 동의</b> — 이메일을 새 수업 공개 소식 발송에만 쓰고, 신청을 철회할 때까지 보관합니다.
              동의하지 않으셔도 되지만, 그 경우 소식을 보내 드릴 수 없습니다. 철회는 {CONTACT_EMAIL}로 알려 주세요.
            </span>
          </label>
          <label className="news-consent">
            <input type="checkbox" checked={agreeXfer} onChange={(e) => setAgreeXfer(e.target.checked)} />
            <span>
              <b>(필수) 개인정보 국외 이전 동의</b> — 이메일이 Formspree, Inc.(미국, team@formspree.io)로 제출 즉시 암호화 전송되어 접수되고, 레브랩 메일(Google, 미국)로 전달됩니다. 레브랩 보관 기간이 끝나면 함께 지웁니다. 동의하지 않으시면 소식을 신청할 수 없습니다. <Link href="/privacy">개인정보 처리방침</Link>
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}

