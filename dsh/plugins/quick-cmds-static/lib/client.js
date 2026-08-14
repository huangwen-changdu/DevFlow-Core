window.__ModuleLoader__.load({
	id: "@devflow-core/dsh-client-quick-cmds",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ── 共享模块（由浏览器 ModuleLoader 提供） ──────────────────────────
		let react = require("react");

		// ── 样式：官方同款 DOM 注入（data-plugin-css 防重） ─────────────────
		const cssText = `
			.dsh-quick-cmds {
				box-sizing: border-box;
				width: calc(100% - var(--dsh-composer-side-clearance) - var(--dsh-composer-side-clearance));
				max-width: var(--dsh-composer-card-max-width);
				margin: 0 auto;
				display: flex;
				align-items: center;
				gap: 6px;
				flex-wrap: wrap;
				padding: 0 2px 6px;
			}
			.dsh-quick-cmds-btn {
				appearance: none;
				border: 1px solid rgba(128, 128, 128, 0.35);
				border-radius: 999px;
				background: rgba(128, 128, 128, 0.12);
				color: inherit;
				font: inherit;
				font-size: 12px;
				line-height: 1;
				padding: 4px 10px;
				cursor: pointer;
				transition: background 0.15s ease;
			}
			.dsh-quick-cmds-btn:hover:not(:disabled) {
				background: rgba(128, 128, 128, 0.25);
				border-color: rgba(128, 128, 128, 0.6);
			}
			.dsh-quick-cmds-btn:disabled {
				opacity: 0.45;
				cursor: not-allowed;
			}
			.dsh-quick-cfg {
				display: flex;
				flex-direction: column;
				gap: 8px;
				padding: 8px;
				max-width: 520px;
			}
			.dsh-quick-cfg-note {
				margin: 0 0 4px;
				font-size: 12px;
				opacity: 0.7;
			}
			.dsh-quick-cfg-status {
				margin: 0 0 4px;
				font-size: 12px;
				opacity: 0.85;
				color: var(--dsw-alias-state-success-primary, #2e7d32);
			}
			.dsh-quick-cfg-error {
				margin: 0 0 4px;
				font-size: 12px;
				opacity: 0.85;
				color: var(--dsw-alias-state-error-primary, #c62828);
			}
			.dsh-quick-cfg-row {
				display: flex;
				flex-direction: column;
				gap: 6px;
				border: 1px solid rgba(128, 128, 128, 0.15);
				border-radius: 8px;
				padding: 8px;
			}
			.dsh-quick-cfg-line {
				display: flex;
				gap: 6px;
				align-items: center;
			}
			.dsh-quick-cfg-input {
				flex: 1;
				min-width: 0;
				appearance: none;
				border: 1px solid rgba(128, 128, 128, 0.35);
				border-radius: 6px;
				background: rgba(128, 128, 128, 0.08);
				color: inherit;
				font: inherit;
				font-size: 13px;
				padding: 5px 8px;
			}
			.dsh-quick-cfg-btn {
				flex: none;
				appearance: none;
				border: 1px solid rgba(128, 128, 128, 0.35);
				border-radius: 6px;
				background: rgba(128, 128, 128, 0.12);
				color: inherit;
				font: inherit;
				font-size: 12px;
				padding: 4px 8px;
				cursor: pointer;
			}
			.dsh-quick-cfg-btn:hover:not(:disabled) {
				background: rgba(128, 128, 128, 0.25);
			}
			.dsh-quick-cfg-btn:disabled {
				opacity: 0.35;
				cursor: default;
			}
			.dsh-quick-cfg-del:hover:not(:disabled) {
				background: rgba(200, 60, 60, 0.25);
				border-color: rgba(200, 60, 60, 0.6);
			}
		`;
		const cssId = "@devflow-core/dsh-client-quick-cmds/main.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(cssId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@devflow-core/dsh-client-quick-cmds";
			tag.dataset.pluginCss = cssId;
			tag.textContent = cssText;
			document.head.appendChild(tag);
		}

		// ── 配置持久化：localStorage 存 JSON + 启动动态加载 ─────────────────
		const STORAGE_KEY = "dsh.quickCmds.v1";
		const defaultItems = [
			{ label: "对抗审查", cmd: "/devflow-adversarial", suffix: "" },
			{ label: "view审查", cmd: "/devflow-prove", suffix: "" },
			{ label: "找茬", cmd: "/devflow-find-fault", suffix: "" }
		];
		function sanitize(raw) {
			return {
				label: typeof raw.label === "string" ? raw.label : "",
				cmd: typeof raw.cmd === "string" ? raw.cmd : "",
				suffix: typeof raw.suffix === "string" ? raw.suffix : ""
			};
		}

		let storageOk = true;
		function readStorage() {
			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (!raw) return null;
				const parsed = JSON.parse(raw);
				return parsed && Array.isArray(parsed.items) ? parsed.items : null;
			} catch (err) {
				storageOk = false;
				return null;
			}
		}
		function writeStorage(items) {
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
				storageOk = true;
			} catch (err) {
				storageOk = false;
			}
		}

		const saved = readStorage();
		let items = saved && saved.length > 0
			? saved.map(sanitize)
			: defaultItems.map((x) => ({ ...x }));
		const listeners = [];
		function emit() { listeners.slice().forEach((fn) => fn()); }
		function subscribe(fn) {
			listeners.push(fn);
			return () => {
				const i = listeners.indexOf(fn);
				if (i >= 0) listeners.splice(i, 1);
			};
		}
		function getItems() { return items; }
		function setItems(next) {
			items = next;
			emit();
			writeStorage(items);
		}
		function updateItem(index, patch) {
			setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
		}
		function addItem() { setItems([...items, { label: "", cmd: "", suffix: "" }]); }
		function removeItem(index) { setItems(items.filter((_, i) => i !== index)); }
		function moveItem(index, delta) {
			const target = index + delta;
			if (target < 0 || target >= items.length) return;
			const next = items.slice();
			const tmp = next[index];
			next[index] = next[target];
			next[target] = tmp;
			setItems(next);
		}

		// 拼出完整发送文本：命令 + 空格 + 后缀（后缀为空则只有命令）
		function buildText(item) {
			return item.suffix ? item.cmd + " " + item.suffix : item.cmd;
		}

		// 防双击：点击后置位，输入机回到 plain 相位才释放
		let clickGuard = false;

		function useStore() {
			const [, setTick] = react.useState(0);
			react.useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
			return getItems();
		}

		function QuickDock(props) {
			const list = useStore();
			const actions = props.inputActions;
			const session = props.session;
			const input = props.input;
			const busy = Boolean(session && session.running) ||
				Boolean(input && input.phase !== "plain");
			if (input && input.phase === "plain") clickGuard = false;
			return react.createElement("div", { className: "dsh-quick-cmds" },
				list.map((item, i) => react.createElement("button", {
					key: i,
					className: "dsh-quick-cmds-btn",
					title: buildText(item),
					disabled: busy,
					onClick: () => {
						if (!actions || busy || clickGuard || !item.cmd) return;
						clickGuard = true;
						actions.setDraft(buildText(item));
						actions.submit();
					}
				}, item.label || item.cmd))
			);
		}

		function QuickConfig() {
			const list = useStore();
			const status = storageOk
				? "配置已保存到浏览器本地，刷新页面后自动恢复。"
				: "当前环境无法本地保存，刷新后配置将恢复默认。";
			return react.createElement("div", { className: "dsh-quick-cfg" },
				react.createElement("p", {
					className: storageOk ? "dsh-quick-cfg-status" : "dsh-quick-cfg-error"
				}, status),
				list.map((item, i) => react.createElement("div", { key: i, className: "dsh-quick-cfg-row" },
					react.createElement("div", { className: "dsh-quick-cfg-line" },
						react.createElement("button", {
							className: "dsh-quick-cfg-btn",
							title: "上移",
							disabled: i === 0,
							onClick: () => moveItem(i, -1)
						}, "↑"),
						react.createElement("button", {
							className: "dsh-quick-cfg-btn",
							title: "下移",
							disabled: i === list.length - 1,
							onClick: () => moveItem(i, 1)
						}, "↓"),
						react.createElement("input", {
							className: "dsh-quick-cfg-input",
							placeholder: "按钮名称",
							value: item.label,
							onChange: (e) => updateItem(i, { label: e.target.value })
						}),
						react.createElement("input", {
							className: "dsh-quick-cfg-input",
							placeholder: "/命令",
							value: item.cmd,
							onChange: (e) => updateItem(i, { cmd: e.target.value })
						}),
						react.createElement("button", {
							className: "dsh-quick-cfg-btn dsh-quick-cfg-del",
							title: "删除",
							onClick: () => removeItem(i)
						}, "删除")
					),
					react.createElement("div", { className: "dsh-quick-cfg-line" },
						react.createElement("input", {
							className: "dsh-quick-cfg-input",
							placeholder: "后缀内容（可选）：点击时发送「命令 + 空格 + 此处内容」",
							value: item.suffix,
							onChange: (e) => updateItem(i, { suffix: e.target.value })
						})
					)
				)),
				react.createElement("button", {
					className: "dsh-quick-cfg-btn dsh-quick-cfg-add",
					onClick: addItem
				}, "+ 添加按钮")
			);
		}

		// ── 插件主体 ───────────────────────────────────────────────────────
		const inject = ["slots"];

		function apply(ctx) {
			const slots = ctx.slots;
			if (slots === undefined) return;
			slots.inject("conversation.input.dock", () => slots.register(
				{ name: "conversation.input.dock", id: "quick-cmds", order: 40 },
				QuickDock
			));
			slots.inject("settings.section", () => slots.register(
				{ name: "settings.section", id: "quick-cmds", order: 30, label: "快捷命令" },
				QuickConfig
			));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
