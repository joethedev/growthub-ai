"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { transcribeAudio } from "@/actions/transcribe";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  type?: "voice";
  duration?: number;
  audioUrl?: string;
}

interface PendingAudio {
  url: string;
  duration: number;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    from: "bot",
    text: 'Salam! Ana ghansawetek Bach tsajjel l-mossarif dyalek b darija. Msek bouton dial micro o goul lia chi haja bhal: "Serfet 50 drham f restaurant" 🎙️',
  },
];

const MAX_SECONDS = 5;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VoiceSpendingModal({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<PendingAudio | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(10);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }

  function stopMediaRecorder(discard = false) {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (discard) {
      mr.ondataavailable = null;
      mr.onstop = null;
    }
    if (mr.state === "recording" || mr.state === "paused") {
      try {
        mr.stream?.getTracks().forEach((t) => t.stop());
        mr.stop();
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null;
  }

  function handleClose() {
    clearTimers();
    stopMediaRecorder(true);
    setRecording(false);
    elapsedRef.current = 0;
    setElapsed(0);
    setProcessing(false);
    if (pendingAudio) URL.revokeObjectURL(pendingAudio.url);
    setPendingAudio(null);
    setMessages(INITIAL_MESSAGES);
    onClose();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processing, pendingAudio]);

  async function handlePointerDown() {
    if (recording || processing || pendingAudio) return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert(
        "Microphone access denied. Please allow microphone access and try again.",
      );
      return;
    }

    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const recordedDuration = Math.max(
        0.5,
        parseFloat(elapsedRef.current.toFixed(1)),
      );
      const blob = new Blob(chunksRef.current, {
        type: mr.mimeType || "audio/webm",
      });
      const url = URL.createObjectURL(blob);
      setPendingAudio({ url, duration: recordedDuration });
    };

    mr.start();
    elapsedRef.current = 0;
    setRecording(true);
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      elapsedRef.current = Math.min(elapsedRef.current + 0.1, MAX_SECONDS);
      setElapsed(elapsedRef.current);
    }, 100);

    timerRef.current = setTimeout(() => {
      stopRecording();
    }, MAX_SECONDS * 1000);
  }

  function stopRecording() {
    if (!recording) return;
    clearTimers();
    setRecording(false);
    elapsedRef.current = 0;
    setElapsed(0);
    stopMediaRecorder(false);
  }

  function handlePointerUp() {
    if (recording) stopRecording();
  }

  async function sendPending() {
    if (!pendingAudio) return;
    const { url, duration } = pendingAudio;
    setPendingAudio(null);

    // Post voice bubble immediately
    setMessages((prev) => [
      ...prev,
      {
        id: ++msgIdRef.current,
        from: "user",
        type: "voice",
        text: "",
        duration,
        audioUrl: url,
      },
    ]);
    setProcessing(true);

    try {
      const blob = await fetch(url).then((r) => r.blob());
      const fd = new FormData();
      fd.append(
        "audio",
        new File([blob], "recording.webm", { type: blob.type || "audio/webm" }),
      );
      const result = await transcribeAudio(fd);
      setProcessing(false);
      if (result.success) {
        setMessages((prev) => [
          ...prev,
          { id: ++msgIdRef.current, from: "bot", text: result.text },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: ++msgIdRef.current,
            from: "bot",
            text: `⚠️ Ma fhemtsh: ${result.error}`,
          },
        ]);
      }
    } catch (err) {
      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: ++msgIdRef.current,
          from: "bot",
          text: `⚠️ Server error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    }
  }

  function discardPending() {
    if (!pendingAudio) return;
    URL.revokeObjectURL(pendingAudio.url);
    setPendingAudio(null);
  }

  const recordProgress = Math.min(elapsed / MAX_SECONDS, 1);

  return (
    <Modal open={open} onClose={handleClose} title="Voice Spending — دارجة">
      <div className="flex flex-col" style={{ height: "400px" }}>
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.from === "bot" && (
                <span
                  className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "hsl(var(--accent)/0.15)",
                    color: "hsl(var(--accent))",
                  }}
                  aria-hidden="true"
                >
                  AI
                </span>
              )}
              <div
                className="max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={{
                  backgroundColor:
                    msg.from === "user"
                      ? "hsl(var(--accent))"
                      : "hsl(var(--bg-tertiary, var(--bg-secondary)))",
                  color:
                    msg.from === "user" ? "#fff" : "hsl(var(--text-primary))",
                  borderBottomRightRadius:
                    msg.from === "user" ? "4px" : undefined,
                  borderBottomLeftRadius:
                    msg.from === "bot" ? "4px" : undefined,
                }}
              >
                {msg.type === "voice" ? (
                  <VoiceBubble
                    duration={msg.duration ?? 1}
                    audioUrl={msg.audioUrl}
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}

          {processing && (
            <div className="flex justify-start">
              <span
                className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "hsl(var(--accent)/0.15)",
                  color: "hsl(var(--accent))",
                }}
                aria-hidden="true"
              >
                AI
              </span>
              <div
                className="flex items-center gap-1 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor:
                    "hsl(var(--bg-tertiary, var(--bg-secondary)))",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <span className="typing-dot" />
                <span
                  className="typing-dot"
                  style={{ animationDelay: "0.18s" }}
                />
                <span
                  className="typing-dot"
                  style={{ animationDelay: "0.36s" }}
                />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Bottom controls */}
        <div
          className="rounded-2xl border border-subtle p-4 flex flex-col items-center gap-3"
          style={{ backgroundColor: "hsl(var(--bg-secondary))" }}
        >
          {/* â”€â”€ PREVIEW: listen before sending â”€â”€ */}
          {pendingAudio && !recording && (
            <>
              <p
                className="text-xs font-medium"
                style={{ color: "hsl(var(--text-primary))" }}
              >
                Sma l-message dyalk qbel ma tsefto ðŸ‘‚
              </p>
              <div
                className="w-full rounded-xl px-3.5 py-2.5"
                style={{ backgroundColor: "hsl(var(--accent))" }}
              >
                <VoiceBubble
                  duration={pendingAudio.duration}
                  audioUrl={pendingAudio.url}
                />
              </div>
              <div className="flex w-full gap-2">
                <button
                  onClick={discardPending}
                  className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor:
                      "hsl(var(--bg-tertiary, var(--bg-secondary)))",
                    color: "hsl(var(--text-muted))",
                    border: "1px solid hsl(var(--border-subtle))",
                  }}
                >
                  ðŸ—‘ Discard
                </button>
                <button
                  onClick={sendPending}
                  className="flex-1 rounded-xl py-2 text-xs font-semibold"
                  style={{
                    backgroundColor: "hsl(var(--accent))",
                    color: "#fff",
                  }}
                >
                  Send âž¤
                </button>
              </div>
            </>
          )}

          {/* â”€â”€ RECORDING / IDLE â”€â”€ */}
          {!pendingAudio && (
            <>
              {recording && (
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor:
                        "hsl(var(--bg-tertiary, var(--border-subtle)))",
                    }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${recordProgress * 100}%`,
                        backgroundColor: "hsl(var(--danger, 0 72% 51%))",
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                  <p className="text-center text-xs text-muted tabular-nums">
                    {elapsed.toFixed(1)}s / {MAX_SECONDS}s
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  disabled={processing}
                  aria-label={
                    recording
                      ? "Recordingâ€¦ release to stop"
                      : "Hold to record"
                  }
                  className="relative flex h-14 w-14 select-none items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    touchAction: "none",
                    backgroundColor: recording
                      ? "hsl(var(--danger, 0 72% 51%))"
                      : "hsl(var(--accent))",
                    color: "#fff",
                    boxShadow: recording
                      ? "0 0 0 8px hsl(var(--danger, 0 72% 51%) / 0.18)"
                      : "0 0 0 0px transparent",
                    transition: "box-shadow 0.3s ease, background-color 0.2s",
                    opacity: processing ? 0.5 : 1,
                    cursor: processing ? "not-allowed" : "pointer",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  {recording && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: "hsl(var(--danger, 0 72% 51%) / 0.3)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </button>

                <p className="text-xs text-muted text-center leading-relaxed">
                  {processing
                    ? "Kansawer sawtkâ€¦"
                    : recording
                      ? "Khelli lbutton bach twaqefâ€¦"
                      : "Msek l-micro o hder b darija"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .typing-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: hsl(var(--text-muted));
          animation: typing-bounce 0.9s infinite ease-in-out;
        }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}

function VoiceBubble({
  duration,
  audioUrl,
}: {
  duration: number;
  audioUrl?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function tick() {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (!audioRef.current.paused) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }

  function togglePlay() {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setPlaying(false);
        setCurrentTime(0);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
    if (playing) {
      audioRef.current.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setPlaying(false);
    } else {
      audioRef.current.play();
      rafRef.current = requestAnimationFrame(tick);
      setPlaying(true);
    }
  }

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const remaining = Math.max(0, duration - currentTime);

  return (
    <div className="flex items-center gap-2" style={{ minWidth: "160px" }}>
      {audioUrl ? (
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}
        >
          {playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      ) : (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </span>
      )}

      <div className="flex flex-1 flex-col gap-1">
        <div
          className="relative h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          />
        </div>
        <div className="flex items-center gap-0.75">
          {[4, 8, 6, 10, 7, 9, 5, 8, 6, 4].map((h, i) => (
            <span
              key={i}
              className="block w-0.75 rounded-full"
              style={{
                height: `${h}px`,
                backgroundColor:
                  progress * 10 > i
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.35)",
                transition: "background-color 0.1s",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <span className="text-xs opacity-75 tabular-nums shrink-0">
        {playing ? `${remaining.toFixed(1)}s` : `${duration.toFixed(1)}s`}
      </span>
    </div>
  );
}
