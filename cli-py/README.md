# CLI example

Re-implement interactive cli like `claude` with sdk.

(caution: it works as `permission_mode="bypassPermissions"`)

### usage

```
uv sync

uv run python main.py
```

### demo

```
> Hi !
[debug] SystemMessage(subtype='init', data={'type': 'system', 'subtype': 'init', 'cwd': '/xxxxx/claude-code-sdk-python-samples/cli', 'session_id': 'afc5cd41-979b-4900-b566-65e218645a25', 'tools': ['Task', 'Bash', 'Glob', 'Grep', 'LS', 'exit_plan_mode', 'Read', 'Edit', 'MultiEdit', 'Write', 'NotebookRead', 'NotebookEdit', 'WebFetch', 'TodoWrite', 'WebSearch'], 'mcp_servers': [], 'model': 'claude-opus-4-20250514', 'permissionMode': 'bypassPermissions', 'apiKeySource': 'none'})

[debug] AssistantMessage(content=[TextBlock(text='Hello! How can I help you today?')])

● Hello! How can I help you today?

[debug] ResultMessage(subtype='success', duration_ms=4305, duration_api_ms=6083, is_error=False, num_turns=1, session_id='afc5cd41-979b-4900-b566-65e218645a25', total_cost_usd=0.02747595, usage={'input_tokens': 3, 'cache_creation_input_tokens': 297, 'cache_read_input_tokens': 13728, 'output_tokens': 13, 'server_tool_use': {'web_search_requests': 0}, 'service_tier': 'standard'}, result='Hello! How can I help you today?')

> /exit

```

