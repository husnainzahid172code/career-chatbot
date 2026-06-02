import { useMemo, useState } from "react";
import type { ChatSession } from "../types";
import { groupSessions } from "../time";

export function Sidebar(props: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}) {
  const groups = useMemo(() => groupSessions(props.sessions), [props.sessions]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");

  return (
    <aside
      className={[
        "h-dvh shrink-0 border-r border-zinc-800 bg-zinc-950/40 backdrop-blur",
        props.collapsed ? "w-[68px]" : "w-[320px]"
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 p-3">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-200 hover:bg-zinc-900"
          type="button"
          onClick={props.onToggleCollapsed}
          title={props.collapsed ? "Expand" : "Collapse"}
        >
          {props.collapsed ? "›" : "‹"}
        </button>

        {!props.collapsed ? (
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-brand-500 active:scale-[0.99]"
              type="button"
              onClick={props.onNew}
            >
              New chat
            </button>
            <button
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              type="button"
              onClick={props.onClearAll}
            >
              Clear
            </button>
          </div>
        ) : (
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow hover:bg-brand-500 active:scale-[0.99]"
            type="button"
            onClick={props.onNew}
            title="New chat"
          >
            +
          </button>
        )}
      </div>

      {!props.collapsed ? (
        <div className="px-3 pb-4">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Sessions
          </div>
        </div>
      ) : null}

      <div className="h-[calc(100dvh-72px)] overflow-auto px-2 pb-4">
        {groups.map((g) => (
          <div key={g.label} className="mb-4">
            {!props.collapsed ? (
              <div className="px-2 pb-2 text-xs font-medium text-zinc-500">{g.label}</div>
            ) : null}
            <div className="space-y-1">
              {g.sessions.map((s) => {
                const active = s.id === props.activeSessionId;
                const renaming = renamingId === s.id;
                return (
                  <div
                    key={s.id}
                    className={[
                      "group flex items-center gap-2 rounded-xl border px-2 py-2",
                      active
                        ? "border-brand-700/60 bg-brand-600/10"
                        : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/30"
                    ].join(" ")}
                  >
                    <button
                      type="button"
                      className={[
                        "flex min-w-0 flex-1 items-center gap-2 text-left",
                        props.collapsed ? "justify-center" : ""
                      ].join(" ")}
                      onClick={() => props.onSelect(s.id)}
                      title={s.title}
                    >
                      <div
                        className={[
                          "h-8 w-8 shrink-0 rounded-lg border border-zinc-800 bg-zinc-950/50",
                          "flex items-center justify-center text-sm text-zinc-300"
                        ].join(" ")}
                      >
                        {active ? "●" : "○"}
                      </div>
                      {!props.collapsed ? (
                        <div className="min-w-0">
                          {renaming ? (
                            <input
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-brand-600"
                              value={renameDraft}
                              onChange={(e) => setRenameDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  props.onRename(s.id, renameDraft.trim() || s.title);
                                  setRenamingId(null);
                                }
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="truncate text-sm text-zinc-100">{s.title}</div>
                          )}
                          <div className="truncate text-xs text-zinc-500">
                            {new Date(s.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      ) : null}
                    </button>

                    {!props.collapsed ? (
                      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                          onClick={() => {
                            setRenamingId(s.id);
                            setRenameDraft(s.title);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-900"
                          onClick={() => props.onDelete(s.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

