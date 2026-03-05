"use client";

import { useOthers, useSelf } from "@/liveblocks.config";

export default function ActiveUsers() {
  const others = useOthers();
  const self = useSelf();

  const users = [
    ...(self
      ? [{ id: "self", name: self.presence?.user?.name || "You", color: self.presence?.user?.color || "#00ffff", isSelf: true }]
      : []),
    ...others.map((other, i) => ({
      id: other.connectionId.toString(),
      name: other.presence?.user?.name || `User ${i + 1}`,
      color: other.presence?.user?.color || "#bf5af2",
      isSelf: false,
    })),
  ];

  return (
    <div className="active-users">
      <div className="users-avatars">
        {users.slice(0, 6).map((user, idx) => (
          <div
            key={user.id}
            className={`avatar ${user.isSelf ? "self" : ""}`}
            style={{
              borderColor: user.color,
              background: `${user.color}12`,
              animationDelay: `${idx * 0.05}s`,
            }}
            title={user.isSelf ? `${user.name} (You)` : user.name}
          >
            <span style={{ color: user.color, textShadow: `0 0 8px ${user.color}40` }}>
              {user.name.split(" ").pop()?.[0]?.toUpperCase() || "?"}
            </span>
            {user.isSelf && <div className="self-ring" style={{ borderColor: user.color }} />}
          </div>
        ))}
        {users.length > 6 && (
          <div className="avatar overflow" title={`${users.length - 6} more`}>
            <span>+{users.length - 6}</span>
          </div>
        )}
      </div>

      <div className="presence-pill">
        <span className="live-dot" />
        <span className="live-text">{users.length} ONLINE</span>
      </div>

      <style jsx>{`
        .active-users {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .users-avatars {
          display: flex;
          align-items: center;
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          margin-left: -7px;
          transition: all var(--transition-spring);
          position: relative;
          z-index: 1;
          animation: fadeInScale 0.3s ease-out both;
        }

        .avatar:first-child { margin-left: 0; }

        .avatar:hover {
          transform: scale(1.2) translateY(-2px);
          z-index: 10;
          box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
        }

        .avatar.self { z-index: 2; }

        .self-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px dashed;
          opacity: 0.35;
          animation: spin 8s linear infinite;
        }

        .avatar.overflow {
          border-color: rgba(0, 255, 255, 0.1);
          background: var(--surface) !important;
        }

        .avatar.overflow span {
          color: var(--text-muted);
          font-size: 10px;
        }

        .presence-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(0, 255, 136, 0.04);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 2px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .live-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--green);
          white-space: nowrap;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .presence-pill { display: none; }
        }
      `}</style>
    </div>
  );
}
