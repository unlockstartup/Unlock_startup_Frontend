"use client"

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import publisherApi from "@/app/publisherapi";

const timeAgo = (dateStr) => {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return "Just now";
};

export default function PublisherNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [page, setPage]                   = useState(1);
  const [pagination, setPagination]       = useState({ page: 1, pages: 1, total: 0 });
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const fetchNotifications = async (p = page) => {
    try {
      setLoading(true);
      const res = await publisherApi.get(`/api/notifications/my?page=${p}&limit=10`);
      setNotifications(res.data?.items || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(page); }, [page]);

  const markAsRead = async (id) => {
    try {
      await publisherApi.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n._id)));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayed   = showUnreadOnly ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .notif-page { font-family: 'Sora', sans-serif; min-height: 100vh; background: #f5f4f0; padding: 32px 24px; }
        .notif-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .notif-title-block h2 { font-size: 1.75rem; font-weight: 700; color: #111; letter-spacing: -0.5px; margin: 0 0 4px; display: flex; align-items: center; gap: 10px; }
        .notif-icon { width: 36px; height: 36px; background: #111; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notif-icon svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .notif-subtitle { color: #888; font-size: 0.85rem; margin: 0; }
        .unread-pill { background: #ef4444; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
        .mark-all-btn { border: 1.5px solid #d1d5db; background: #fff; color: #444; font-size: 0.8rem; font-weight: 600; font-family: 'Sora', sans-serif; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.15s; align-self: center; }
        .mark-all-btn:hover { background: #111; color: #fff; border-color: #111; }
        .notif-tabs { display: flex; gap: 6px; margin-bottom: 16px; }
        .notif-tab { font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600; padding: 6px 14px; border-radius: 999px; border: 1.5px solid #e5e7eb; background: #fff; color: #888; cursor: pointer; transition: all 0.15s; }
        .notif-tab.active { background: #111; color: #fff; border-color: #111; }
        .notif-list { display: flex; flex-direction: column; gap: 10px; }
        .notif-card { background: #fff; border-radius: 14px; border: 1.5px solid #e9e9e4; padding: 18px 20px; display: flex; gap: 16px; align-items: flex-start; transition: box-shadow 0.15s, border-color 0.15s; position: relative; overflow: hidden; animation: slideIn 0.25s ease both; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .notif-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); border-color: #ccc; }
        .notif-card.unread { background: #fffdf5; border-color: #fde68a; }
        .notif-card.unread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #f59e0b; border-radius: 3px 0 0 3px; }
        .notif-avatar { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg,#111 0%,#3b3b3b 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.75rem; font-weight: 700; color: #fff; }
        .notif-card.unread .notif-avatar { background: linear-gradient(135deg,#f59e0b 0%,#d97706 100%); }
        .notif-body { flex: 1; min-width: 0; }
        .notif-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
        .notif-card-title { font-weight: 600; font-size: 0.9rem; color: #111; margin: 0; }
        .notif-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .notif-time { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #aaa; }
        .notif-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; box-shadow: 0 0 0 3px #fef3c7; }
        .notif-desc { font-size: 0.83rem; color: #666; margin: 0 0 10px; line-height: 1.5; }
        .notif-footer { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .notif-doc-link { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 600; color: #2563eb; text-decoration: none; background: #eff6ff; padding: 4px 10px; border-radius: 6px; }
        .notif-doc-link:hover { background: #dbeafe; }
        .notif-doc-link svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .mark-read-btn { font-family: 'Sora', sans-serif; font-size: 0.75rem; font-weight: 600; border: 1.5px solid #e5e7eb; background: transparent; color: #666; padding: 4px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
        .mark-read-btn:hover { border-color: #111; color: #111; }
        .read-check { display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #aaa; font-weight: 500; }
        .read-check svg { width: 13px; height: 13px; stroke: #10b981; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .notif-empty { text-align: center; padding: 64px 24px; background: #fff; border-radius: 14px; border: 1.5px dashed #e5e7eb; }
        .notif-empty-icon { width: 56px; height: 56px; background: #f3f4f6; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .notif-empty-icon svg { width: 26px; height: 26px; stroke: #9ca3af; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
        .notif-empty h4 { font-size: 0.95rem; font-weight: 600; color: #444; margin: 0 0 6px; }
        .notif-empty p { color: #aaa; font-size: 0.82rem; margin: 0; }
        .skeleton-card { background: #fff; border-radius: 14px; border: 1.5px solid #e9e9e4; padding: 18px 20px; display: flex; gap: 16px; }
        .skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .notif-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
        .page-info { font-size: 0.8rem; color: #aaa; font-family: 'JetBrains Mono', monospace; }
        .page-btns { display: flex; gap: 6px; }
        .page-btn { font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600; border: 1.5px solid #e5e7eb; background: #fff; color: #444; padding: 7px 16px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { background: #111; color: #fff; border-color: #111; }
      `}</style>

      <div className="notif-page">
        {/* Header */}
        <div className="notif-header">
          <div className="notif-title-block">
            <h2>
              <span className="notif-icon">
                <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </span>
              Notifications
              {unreadCount > 0 && <span className="unread-pill">{unreadCount} new</span>}
            </h2>
            <p className="notif-subtitle">Updates and announcements from admin</p>
          </div>
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>Mark all as read</button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="notif-tabs">
          <button
            className={`notif-tab${!showUnreadOnly ? " active" : ""}`}
            onClick={() => setShowUnreadOnly(false)}
          >
            All
          </button>
          <button
            className={`notif-tab${showUnreadOnly ? " active" : ""}`}
            onClick={() => setShowUnreadOnly(true)}
          >
            Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="notif-list">
            {[1, 2, 3].map((i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: "75%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 12, width: "55%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">
              <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </div>
            <h4>You're all caught up</h4>
            <p>{showUnreadOnly ? "No unread notifications." : "No notifications yet."}</p>
          </div>
        ) : (
          <div className="notif-list">
            {displayed.map((n, idx) => (
              <div
                key={n._id}
                className={`notif-card${!n.isRead ? " unread" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="notif-avatar">
                  {n.title?.charAt(0).toUpperCase() || "A"}
                </div>

                <div className="notif-body">
                  <div className="notif-card-top">
                    <p className="notif-card-title">{n.title}</p>
                    <div className="notif-meta">
                      <span className="notif-time">{timeAgo(n.createdAt)}</span>
                      {!n.isRead && <span className="notif-status-dot" />}
                    </div>
                  </div>

                  <p className="notif-desc">{n.description}</p>

                  <div className="notif-footer">
                    {n.docLink && (
                      <a href={n.docLink} target="_blank" rel="noreferrer" className="notif-doc-link">
                        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        View document
                      </a>
                    )}
                    {!n.isRead ? (
                      <button className="mark-read-btn" onClick={() => markAsRead(n._id)}>
                        Mark as read
                      </button>
                    ) : (
                      <span className="read-check">
                        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination — only for "All" tab since unread is client-filtered */}
        {!showUnreadOnly && pagination.pages > 1 && (
          <div className="notif-pagination">
            <span className="page-info">
              {pagination.page} / {pagination.pages} pages · {pagination.total} total
            </span>
            <div className="page-btns">
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >← Prev</button>
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                disabled={page === pagination.pages}
              >Next →</button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" />
    </>
  );
}